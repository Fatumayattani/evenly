"use client";

import { useState } from "react";
import {
  CircleDollarSign,
  LifeBuoy,
  Plus,
  RotateCcw,
  UsersRound,
} from "lucide-react";
import { useProductStore } from "@/lib/product-store";
import { WalletControl } from "./wallet-control";
import { LifeView } from "./life-view";
import { GroupsView } from "./groups-view";
import { AddIncomeModal } from "./add-income-modal";
import { ProofButton } from "./proof-button";
import { ActivityList } from "./activity-list";
import { EvenlyLogo } from "./evenly-logo";

export function ProductApp() {
  const { state, setActiveSpace, resetDemo } = useProductStore();
  const [incomeOpen, setIncomeOpen] = useState(false);

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <EvenlyLogo light />

        <nav className="main-nav" aria-label="Primary navigation">
          <button
            className={state.activeSpace === "life" ? "active" : ""}
            onClick={() => setActiveSpace("life")}
          >
            <LifeBuoy size={19} />
            <span>Life</span>
          </button>

          <button
            className={state.activeSpace === "groups" ? "active" : ""}
            onClick={() => setActiveSpace("groups")}
          >
            <UsersRound size={19} />
            <span>Groups</span>
          </button>
        </nav>

        <div className="sidebar-note">
          <CircleDollarSign size={20} />
          <strong>Demo ledger</strong>
          <p>
            Product state is local. Connect a wallet to anchor a
            verifiable fingerprint on Devnet.
          </p>
        </div>

        <button className="reset-button" onClick={resetDemo}>
          <RotateCcw size={15} />
          <span>Reset demo</span>
        </button>
      </aside>

      <section className="main-column">
        <header className="topbar">
          <EvenlyLogo compact className="mobile-brand" />

          <div className="topbar-copy">
            <p>Friday, 10 July</p>
            <strong>
              {state.activeSpace === "life"
                ? "Your Life plan"
                : "Your Groups"}
            </strong>
          </div>

          <div className="topbar-actions">
            <ProofButton />
            <WalletControl />

            <button
              className="add-income-button"
              onClick={() => setIncomeOpen(true)}
            >
              <Plus size={17} />
              Add income
            </button>
          </div>
        </header>

        <div className="content-area">
          {state.activeSpace === "life" ? (
            <LifeView onAddIncome={() => setIncomeOpen(true)} />
          ) : (
            <GroupsView />
          )}

          <ActivityList />
        </div>
      </section>

      <AddIncomeModal
        open={incomeOpen}
        onClose={() => setIncomeOpen(false)}
      />
    </main>
  );
}