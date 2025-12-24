import { useState } from 'react';
import LandingPage from './components/LandingPage';
import AuthModal from './components/AuthModal';
import Dashboard from './components/Dashboard';
import { User } from './types';

function App() {
  const [showAuth, setShowAuth] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleAuth = (email: string, name: string) => {
    const user: User = {
      id: '1',
      email,
      name,
      walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    };
    setCurrentUser(user);
    setShowAuth(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (currentUser) {
    return <Dashboard user={currentUser} onLogout={handleLogout} />;
  }

  return (
    <>
      <LandingPage onGetStarted={() => setShowAuth(true)} />
      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} onAuth={handleAuth} />
      )}
    </>
  );
}

export default App;
