# Evenly

![Evenly Logo](./public/evenlogo.png)


**Split expenses instantly, fairly**

Evenly is a modern household expense tracker that makes sharing costs simple, transparent, and instant using **Privy embedded wallets** on the **Movement blockchain**. No more awkward money conversations or messy spreadsheets.

## Built With

- **Movement Blockchain** – [https://movement.xyz](https://movement.xyz)  
- **Privy Wallets** – [https://privy.io](https://privy.io)  

---

## Features

### Instant Settlement

* Expenses are split and settled immediately – no waiting until month-end
* Real-time balance tracking shows what you paid vs what you owe

### Smart Expense Management

* Track rent, utilities, groceries, subscriptions, and other shared costs
* Categorize expenses for better organization
* View complete expense history with detailed breakdowns

### Household Groups

* Organize expenses by household
* Invite roommates and track shared costs together
* See who paid for what at a glance

### Embedded Wallet Integration

* Privy embedded wallet created automatically on first login
* No external wallet installation required
* Secure authentication via email or social login
* Blockchain-powered transparency and security

### Beautiful, Intuitive Interface

* Modern design with smooth animations
* Responsive layout for all devices
* Clear visual hierarchy and balance summaries
* Real-time updates

---

## Tech Stack

* **Frontend:** React 18 + TypeScript + Vite
* **Styling:** Tailwind CSS
* **Authentication:** Privy (embedded wallet)
* **Database:** Bolt Database
* **Blockchain:** Movement
* **Icons:** Lucide React
* **Build Tool:** Vite

---

## Prerequisites

* Node.js 18+ and npm
* Privy account and App ID ([Get started](#))
* Bolt Database project ([Create one](#))

---

## Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd evenly
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**
   Create a `.env` file in the root directory:

```env
VITE_PRIVY_APP_ID=your_privy_app_id
VITE_SUPABASE_URL=your_bolt_database_url
VITE_SUPABASE_ANON_KEY=your_bolt_database_anon_key
```

4. **Run the app**

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173)

---

## Building for Production

```bash
npm run build
npm run preview
```

Production-ready files will be in the `dist/` directory.

---

## Development Tools

* **Type Checking:** `npm run typecheck`
* **Linting:** `npm run lint`

---

## Project Structure

```
evenly/
├── src/
│   ├── components/
│   │   ├── AddExpenseModal.tsx
│   │   ├── AuthModal.tsx
│   │   ├── Dashboard.tsx
│   │   ├── ExpenseCard.tsx
│   │   ├── LandingPage.tsx
│   │   └── WalletSection.tsx
│   ├── App.tsx
│   ├── main.tsx
│   ├── types.ts
│   └── index.css
├── .env
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

---

## How It Works

1. **Connect Wallet:** Users log in with email or social account. Privy automatically creates an embedded wallet.
2. **Create Household:** Set up your household and invite roommates using wallet addresses or email.
3. **Add Expenses:** Log shared expenses (rent, utilities, groceries, etc.) and specify who to split with.
4. **Automatic Splitting:** Evenly calculates each person’s share and updates balances in real-time.
5. **Track Balances:** Dashboard shows:

   * Total you’ve paid
   * Total you owe
   * Net balance
6. **Instant Settlement:** Payments are processed instantly via embedded wallets on the Movement blockchain.

---

## Expense Categories

* **Rent:** Monthly rent payments
* **Utilities:** Electricity, water, internet, gas
* **Groceries:** Shared food and household items
* **Subscriptions:** Netflix, Spotify, shared services
* **Other:** Miscellaneous expenses

---

## Wallet Section

* View embedded wallet address
* Check wallet balance
* Transaction history
* Secure and transparent

---

## Deployment

Deploy to any static hosting service:

* Vercel: `vercel deploy`
* Netlify: `netlify deploy --prod`
* AWS S3 + CloudFront
* GitHub Pages

Set environment variables in your hosting platform dashboard.

---

## Security Best Practices

* Never commit `.env` to version control
* Use Row Level Security (RLS) in Bolt Database
* Validate all user inputs
* Keep dependencies updated
* Use HTTPS in production
* Implement proper authentication checks

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## License

MIT License

---

## Support

* Open an issue on GitHub
* Check documentation

