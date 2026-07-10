use anchor_lang::prelude::*;
use anchor_spl::token_interface::{self, Mint, TokenAccount, TokenInterface, TransferChecked};

declare_id!("Fg6PaFpoGXkYsidMpWxTWqkZqQL7LpoYwTksr3G9Kz");

const MAX_GROUP_NAME: usize = 48;
const MAX_GROUP_PURPOSE: usize = 96;

#[program]
pub mod coordination {
    use super::*;

    pub fn initialize_profile(ctx: Context<InitializeProfile>, currency: [u8; 3]) -> Result<()> {
        require!(currency.iter().all(|byte| byte.is_ascii_uppercase()), CoordinationError::InvalidCurrency);
        let profile = &mut ctx.accounts.profile;
        profile.owner = ctx.accounts.owner.key();
        profile.currency = currency;
        profile.bump = ctx.bumps.profile;
        Ok(())
    }

    pub fn create_group(ctx: Context<CreateGroup>, args: CreateGroupArgs) -> Result<()> {
        require!(!args.name.trim().is_empty(), CoordinationError::EmptyName);
        require!(args.name.len() <= MAX_GROUP_NAME, CoordinationError::NameTooLong);
        require!(args.purpose.len() <= MAX_GROUP_PURPOSE, CoordinationError::PurposeTooLong);
        require!(args.approval_threshold > 0, CoordinationError::InvalidThreshold);
        require!(args.contribution_amount > 0, CoordinationError::InvalidAmount);

        let group = &mut ctx.accounts.group;
        group.authority = ctx.accounts.authority.key();
        group.mint = ctx.accounts.mint.key();
        group.treasury = ctx.accounts.treasury.key();
        group.group_id = args.group_id;
        group.name = args.name;
        group.purpose = args.purpose;
        group.contribution_amount = args.contribution_amount;
        group.approval_threshold = args.approval_threshold;
        group.member_count = 1;
        group.next_proposal_id = 0;
        group.bump = ctx.bumps.group;

        let member = &mut ctx.accounts.founding_member;
        member.group = group.key();
        member.owner = ctx.accounts.authority.key();
        member.total_contributed = 0;
        member.active = true;
        member.bump = ctx.bumps.founding_member;

        emit!(GroupCreated {
            group: group.key(),
            authority: ctx.accounts.authority.key(),
            mint: ctx.accounts.mint.key(),
            group_id: args.group_id,
        });
        Ok(())
    }

    pub fn join_group(ctx: Context<JoinGroup>) -> Result<()> {
        let group = &mut ctx.accounts.group;
        let member = &mut ctx.accounts.member;
        member.group = group.key();
        member.owner = ctx.accounts.owner.key();
        member.total_contributed = 0;
        member.active = true;
        member.bump = ctx.bumps.member;
        group.member_count = group.member_count.checked_add(1).ok_or(CoordinationError::MathOverflow)?;
        emit!(MemberJoined { group: group.key(), member: ctx.accounts.owner.key() });
        Ok(())
    }

    pub fn contribute(ctx: Context<Contribute>, amount: u64, receipt_hash: [u8; 32]) -> Result<()> {
        require!(amount > 0, CoordinationError::InvalidAmount);
        let cpi_accounts = TransferChecked {
            mint: ctx.accounts.mint.to_account_info(),
            from: ctx.accounts.member_token_account.to_account_info(),
            to: ctx.accounts.treasury.to_account_info(),
            authority: ctx.accounts.member_owner.to_account_info(),
        };
        token_interface::transfer_checked(
            CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts),
            amount,
            ctx.accounts.mint.decimals,
        )?;
        let member = &mut ctx.accounts.member;
        member.total_contributed = member.total_contributed.checked_add(amount).ok_or(CoordinationError::MathOverflow)?;
        emit!(ContributionRecorded {
            group: ctx.accounts.group.key(),
            member: ctx.accounts.member_owner.key(),
            amount,
            receipt_hash,
        });
        Ok(())
    }

    pub fn create_payout_proposal(
        ctx: Context<CreatePayoutProposal>,
        recipient: Pubkey,
        amount: u64,
        memo_hash: [u8; 32],
    ) -> Result<()> {
        require!(amount > 0, CoordinationError::InvalidAmount);
        let group = &mut ctx.accounts.group;
        let proposal = &mut ctx.accounts.proposal;
        proposal.group = group.key();
        proposal.proposal_id = group.next_proposal_id;
        proposal.proposer = ctx.accounts.proposer.key();
        proposal.recipient = recipient;
        proposal.amount = amount;
        proposal.memo_hash = memo_hash;
        proposal.approvals = 0;
        proposal.executed = false;
        proposal.bump = ctx.bumps.proposal;
        group.next_proposal_id = group.next_proposal_id.checked_add(1).ok_or(CoordinationError::MathOverflow)?;
        emit!(PayoutProposed { group: group.key(), proposal: proposal.key(), recipient, amount });
        Ok(())
    }

    pub fn approve_payout(ctx: Context<ApprovePayout>) -> Result<()> {
        require!(!ctx.accounts.proposal.executed, CoordinationError::AlreadyExecuted);
        let approval = &mut ctx.accounts.approval;
        approval.proposal = ctx.accounts.proposal.key();
        approval.approver = ctx.accounts.approver.key();
        approval.bump = ctx.bumps.approval;
        let proposal = &mut ctx.accounts.proposal;
        proposal.approvals = proposal.approvals.checked_add(1).ok_or(CoordinationError::MathOverflow)?;
        emit!(PayoutApproved { proposal: proposal.key(), approver: ctx.accounts.approver.key(), approvals: proposal.approvals });
        Ok(())
    }

    pub fn execute_payout(ctx: Context<ExecutePayout>) -> Result<()> {
        let group = &ctx.accounts.group;
        let proposal = &mut ctx.accounts.proposal;
        require!(!proposal.executed, CoordinationError::AlreadyExecuted);
        require!(proposal.approvals >= u16::from(group.approval_threshold), CoordinationError::InsufficientApprovals);
        require!(ctx.accounts.treasury.amount >= proposal.amount, CoordinationError::InsufficientTreasury);

        let group_id_bytes = group.group_id.to_le_bytes();
        let signer_seeds: &[&[u8]] = &[
            b"group",
            group.authority.as_ref(),
            group_id_bytes.as_ref(),
            &[group.bump],
        ];
        let signer = &[signer_seeds];
        let cpi_accounts = TransferChecked {
            mint: ctx.accounts.mint.to_account_info(),
            from: ctx.accounts.treasury.to_account_info(),
            to: ctx.accounts.recipient_token_account.to_account_info(),
            authority: ctx.accounts.group.to_account_info(),
        };
        token_interface::transfer_checked(
            CpiContext::new_with_signer(ctx.accounts.token_program.to_account_info(), cpi_accounts, signer),
            proposal.amount,
            ctx.accounts.mint.decimals,
        )?;
        proposal.executed = true;
        emit!(PayoutExecuted { proposal: proposal.key(), recipient: proposal.recipient, amount: proposal.amount });
        Ok(())
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct CreateGroupArgs {
    pub group_id: u64,
    pub name: String,
    pub purpose: String,
    pub contribution_amount: u64,
    pub approval_threshold: u8,
}

#[derive(Accounts)]
pub struct InitializeProfile<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(init, payer = owner, space = 8 + UserProfile::INIT_SPACE, seeds = [b"profile", owner.key().as_ref()], bump)]
    pub profile: Account<'info, UserProfile>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(args: CreateGroupArgs)]
pub struct CreateGroup<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    pub mint: InterfaceAccount<'info, Mint>,
    #[account(
        init,
        payer = authority,
        space = 8 + Group::INIT_SPACE,
        seeds = [b"group", authority.key().as_ref(), args.group_id.to_le_bytes().as_ref()],
        bump
    )]
    pub group: Account<'info, Group>,
    #[account(
        init,
        payer = authority,
        seeds = [b"treasury", group.key().as_ref()],
        bump,
        token::mint = mint,
        token::authority = group,
        token::token_program = token_program
    )]
    pub treasury: InterfaceAccount<'info, TokenAccount>,
    #[account(
        init,
        payer = authority,
        space = 8 + Member::INIT_SPACE,
        seeds = [b"member", group.key().as_ref(), authority.key().as_ref()],
        bump
    )]
    pub founding_member: Account<'info, Member>,
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct JoinGroup<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(mut)]
    pub group: Account<'info, Group>,
    #[account(
        init,
        payer = owner,
        space = 8 + Member::INIT_SPACE,
        seeds = [b"member", group.key().as_ref(), owner.key().as_ref()],
        bump
    )]
    pub member: Account<'info, Member>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Contribute<'info> {
    #[account(mut)]
    pub member_owner: Signer<'info>,
    pub group: Account<'info, Group>,
    #[account(
        mut,
        seeds = [b"member", group.key().as_ref(), member_owner.key().as_ref()],
        bump = member.bump,
        constraint = member.active @ CoordinationError::InactiveMember
    )]
    pub member: Account<'info, Member>,
    #[account(address = group.mint)]
    pub mint: InterfaceAccount<'info, Mint>,
    #[account(mut, token::mint = mint, token::authority = member_owner, token::token_program = token_program)]
    pub member_token_account: InterfaceAccount<'info, TokenAccount>,
    #[account(mut, address = group.treasury, token::mint = mint, token::authority = group, token::token_program = token_program)]
    pub treasury: InterfaceAccount<'info, TokenAccount>,
    pub token_program: Interface<'info, TokenInterface>,
}

#[derive(Accounts)]
pub struct CreatePayoutProposal<'info> {
    #[account(mut)]
    pub proposer: Signer<'info>,
    #[account(mut)]
    pub group: Account<'info, Group>,
    #[account(
        seeds = [b"member", group.key().as_ref(), proposer.key().as_ref()],
        bump = member.bump,
        constraint = member.active @ CoordinationError::InactiveMember
    )]
    pub member: Account<'info, Member>,
    #[account(
        init,
        payer = proposer,
        space = 8 + PayoutProposal::INIT_SPACE,
        seeds = [b"proposal", group.key().as_ref(), group.next_proposal_id.to_le_bytes().as_ref()],
        bump
    )]
    pub proposal: Account<'info, PayoutProposal>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ApprovePayout<'info> {
    #[account(mut)]
    pub approver: Signer<'info>,
    pub group: Account<'info, Group>,
    #[account(seeds = [b"member", group.key().as_ref(), approver.key().as_ref()], bump = member.bump, constraint = member.active @ CoordinationError::InactiveMember)]
    pub member: Account<'info, Member>,
    #[account(mut, has_one = group)]
    pub proposal: Account<'info, PayoutProposal>,
    #[account(
        init,
        payer = approver,
        space = 8 + Approval::INIT_SPACE,
        seeds = [b"approval", proposal.key().as_ref(), approver.key().as_ref()],
        bump
    )]
    pub approval: Account<'info, Approval>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ExecutePayout<'info> {
    #[account(mut)]
    pub executor: Signer<'info>,
    #[account(seeds = [b"member", group.key().as_ref(), executor.key().as_ref()], bump = member.bump, constraint = member.active @ CoordinationError::InactiveMember)]
    pub member: Account<'info, Member>,
    pub group: Account<'info, Group>,
    #[account(mut, has_one = group, constraint = proposal.recipient == recipient_token_account.owner @ CoordinationError::InvalidRecipient)]
    pub proposal: Account<'info, PayoutProposal>,
    #[account(address = group.mint)]
    pub mint: InterfaceAccount<'info, Mint>,
    #[account(mut, address = group.treasury, token::mint = mint, token::authority = group, token::token_program = token_program)]
    pub treasury: InterfaceAccount<'info, TokenAccount>,
    #[account(mut, token::mint = mint, token::token_program = token_program)]
    pub recipient_token_account: InterfaceAccount<'info, TokenAccount>,
    pub token_program: Interface<'info, TokenInterface>,
}

#[account]
#[derive(InitSpace)]
pub struct UserProfile {
    pub owner: Pubkey,
    pub currency: [u8; 3],
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Group {
    pub authority: Pubkey,
    pub mint: Pubkey,
    pub treasury: Pubkey,
    pub group_id: u64,
    #[max_len(48)]
    pub name: String,
    #[max_len(96)]
    pub purpose: String,
    pub contribution_amount: u64,
    pub approval_threshold: u8,
    pub member_count: u16,
    pub next_proposal_id: u64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Member {
    pub group: Pubkey,
    pub owner: Pubkey,
    pub total_contributed: u64,
    pub active: bool,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct PayoutProposal {
    pub group: Pubkey,
    pub proposal_id: u64,
    pub proposer: Pubkey,
    pub recipient: Pubkey,
    pub amount: u64,
    pub memo_hash: [u8; 32],
    pub approvals: u16,
    pub executed: bool,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Approval {
    pub proposal: Pubkey,
    pub approver: Pubkey,
    pub bump: u8,
}

#[event]
pub struct GroupCreated { pub group: Pubkey, pub authority: Pubkey, pub mint: Pubkey, pub group_id: u64 }
#[event]
pub struct MemberJoined { pub group: Pubkey, pub member: Pubkey }
#[event]
pub struct ContributionRecorded { pub group: Pubkey, pub member: Pubkey, pub amount: u64, pub receipt_hash: [u8; 32] }
#[event]
pub struct PayoutProposed { pub group: Pubkey, pub proposal: Pubkey, pub recipient: Pubkey, pub amount: u64 }
#[event]
pub struct PayoutApproved { pub proposal: Pubkey, pub approver: Pubkey, pub approvals: u16 }
#[event]
pub struct PayoutExecuted { pub proposal: Pubkey, pub recipient: Pubkey, pub amount: u64 }

#[error_code]
pub enum CoordinationError {
    #[msg("Amount must be greater than zero.")]
    InvalidAmount,
    #[msg("Approval threshold must be greater than zero.")]
    InvalidThreshold,
    #[msg("Group name cannot be empty.")]
    EmptyName,
    #[msg("Group name is too long.")]
    NameTooLong,
    #[msg("Group purpose is too long.")]
    PurposeTooLong,
    #[msg("Currency must be a three-letter uppercase code.")]
    InvalidCurrency,
    #[msg("Member is not active.")]
    InactiveMember,
    #[msg("The payout has already been executed.")]
    AlreadyExecuted,
    #[msg("The payout does not have enough approvals.")]
    InsufficientApprovals,
    #[msg("The treasury does not have enough funds.")]
    InsufficientTreasury,
    #[msg("The recipient token account does not match the proposal.")]
    InvalidRecipient,
    #[msg("Arithmetic overflow.")]
    MathOverflow,
}
