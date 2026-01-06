import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import WalletSection from './components/WalletSection';
import { User } from './types';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  const navigate = useNavigate();

  const handleAuth = (email: string, name: string) => {
    const user: User = {
      id: '1',
      email,
      name,
      walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    };
    setCurrentUser(user);
    setShowAuth(false);
    navigate('/dashboard'); // go to dashboard immediately
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/'); // back to landing
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <LandingPage onGetStarted={() => setShowAuth(true)} />
            {showAuth && (
              <WalletSection onClose={() => setShowAuth(false)} onAuth={handleAuth} />
            )}
          </>
        }
      />
      <Route
        path="/dashboard"
        element={
          currentUser ? (
            <Dashboard user={currentUser} onLogout={handleLogout} />
          ) : (
            <LandingPage onGetStarted={() => setShowAuth(true)} />
          )
        }
      />
    </Routes>
  );
}

export default App;
