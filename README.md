Evenly
Split expenses instantly, fairly

Evenly is a modern household expense tracking application that makes sharing costs simple, transparent, and instant using Privy embedded wallets on the Movement blockchain. No more awkward money conversations or complicated spreadsheets.

Features
Instant Settlement

Expenses are split and settled immediately - no waiting until month-end
Real-time balance tracking shows what you paid vs what you owe
Smart Expense Management

Track rent, utilities, groceries, subscriptions, and other shared costs
Categorize expenses for better organization
View complete expense history with detailed breakdowns
Household Groups

Organize expenses by household
Invite roommates and track shared costs together
See who paid for what at a glance
Embedded Wallet Integration

Privy embedded wallet created automatically on first login
No external wallet installation required
Secure authentication via email or social login
Blockchain-powered transparency and security
Beautiful, Intuitive Interface

Modern design with smooth animations
Responsive layout works on all devices
Clear visual hierarchy and balance summaries
Real-time updates
Tech Stack
Frontend: React 18 + TypeScript + Vite
Styling: Tailwind CSS
Authentication: Privy (embedded wallet)
Blockchain: Movement
Icons: Lucide React
Build Tool: Vite
Prerequisites
Node.js 18+ and npm
Privy account and App ID (Get started)
Bolt Database project (Create one)
Installation
Clone the repository

git clone https://github.com/Fatumayattani/evenly.git
cd evenly
Install dependencies

npm install
Configure environment variables
Create a .env file in the root directory:




npm run dev
The app will be available at http://localhost:5173

Building for Production

npm run build
The production-ready files will be in the dist/ directory.

Preview Production Build

npm run preview
Type Checking

npm run typecheck
Linting

npm run lint
Project Structure

evenly/
├── src/
│   ├── components/
│   │   ├── AddExpenseModal.tsx    # Modal for adding new expenses
│   │   ├── AuthModal.tsx          # Authentication modal (to be replaced with Privy)
│   │   ├── Dashboard.tsx          # Main dashboard view
│   │   ├── ExpenseCard.tsx        # Individual expense display
│   │   ├── LandingPage.tsx        # Landing page
│   │   └── WalletSection.tsx      # Wallet information display
│   ├── App.tsx                    # Main app component
│   ├── main.tsx                   # App entry point
│   ├── types.ts                   # TypeScript type definitions
│   └── index.css                  # Global styles
├── .env                           # Environment variables (not in repo)
├── tailwind.config.js             # Tailwind configuration
├── vite.config.ts                 # Vite configuration
└── package.json                   # Project dependencies
How It Works
Connect Wallet: Users log in with email or social account. Privy automatically creates an embedded wallet for them.

Create Household: Set up your household and invite roommates using their wallet addresses or email.

Add Expenses: Log any shared expense (rent, utilities, groceries, etc.) and specify who it should be split with.

Automatic Splitting: Evenly automatically calculates each person's share and updates everyone's balance.

Track Balances: Dashboard shows:

Total you've paid
Total you owe
Net balance (positive if others owe you, negative if you owe others)
Instant Settlement: Payments are processed instantly via embedded wallets on the Movement blockchain.

Key Features in Detail
Expense Categories
Rent: Monthly rent payments
Utilities: Electricity, water, internet, gas
Groceries: Shared food and household items
Subscriptions: Netflix, Spotify, shared services
Other: Miscellaneous shared expenses
Balance Tracking
See total expenses you've paid
Track how much you owe others
View net balance across all expenses
Filter by household or time period
Wallet Section
View your embedded wallet address
Check wallet balance
Transaction history
Secure and transparent
Environment Configuration
Variable	Description	Required
VITE_PRIVY_APP_ID	Your Privy application ID	Yes
Deployment
The app can be deployed to any static hosting service:

Vercel: vercel deploy
Netlify: netlify deploy --prod
AWS S3 + CloudFront
GitHub Pages
Make sure to set environment variables in your hosting platform's dashboard.

Security Best Practices
Never commit .env file to version control
Use Row Level Security (RLS) in Bolt Database
Validate all user inputs
Keep dependencies updated
Use HTTPS in production
Implement proper authentication checks
Contributing
Contributions are welcome! Please follow these steps:

Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request
License
This project is licensed under the MIT License.

Support
For questions or issues:

Open an issue on GitHub
Contact the development team
Check documentation
