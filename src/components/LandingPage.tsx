import { Home, Zap, Shield, DollarSign, Users, ArrowRight } from 'lucide-react';
import { usePrivy, useCreateWallet, useWallets } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

interface LandingPageProps {}

export default function LandingPage(props: LandingPageProps) {
  const { login, user } = usePrivy();
  const { wallets } = useWallets();
  const { createWallet } = useCreateWallet();
  const navigate = useNavigate();

  // Automatically create a wallet if none exists after login
  useEffect(() => {
    const setupWallet = async () => {
      if (user && wallets.length === 0) {
        await createWallet();
      }
    };
    setupWallet();
  }, [user, wallets, createWallet]);

  const onGetStarted = async () => {
    try {
      await login(); // triggers Privy login modal
      if (wallets.length === 0) {
        await createWallet();
      }
      navigate('/dashboard');
    } catch (err) {
      console.error('Privy login failed', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <nav className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-400 rounded-xl flex items-center justify-center">
            <Home className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
            Evenly
          </span>
        </div>
        <button
          onClick={onGetStarted}
          className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full font-medium hover:shadow-lg hover:scale-105 transition-all"
        >
          Connect Wallet
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Split expenses
              <br />
              <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                instantly, fairly
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              No more awkward money conversations. Evenly makes sharing household expenses simple, transparent, and instant with blockchain-powered payments.
            </p>
            <button
              onClick={onGetStarted}
              className="px-10 py-4 bg-gradient-to-r from-primary-500 to-accent-400 text-white rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all inline-flex items-center gap-2"
            >
              Start Splitting Now
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-200/40 to-accent-200/40 rounded-3xl blur-3xl"></div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
              <img
                src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Friends sharing expenses and living together"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="text-2xl font-bold mb-2">Live together, stress-free</h3>
                <p className="text-white/90 leading-relaxed">Fair, transparent, and instant expense splitting for modern households.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <FeatureCard
            icon={<Zap className="w-6 h-6" />}
            title="Instant Settlement"
            description="Expenses are split and settled immediately. No waiting until month-end."
          />
          <FeatureCard
            icon={<DollarSign className="w-6 h-6" />}
            title="Low-Cost Payments"
            description="Fast, affordable transactions on Movement blockchain."
          />
          <FeatureCard
            icon={<Users className="w-6 h-6" />}
            title="Household Groups"
            description="Organize by household and track expenses with all your roommates."
          />
          <FeatureCard
            icon={<Shield className="w-6 h-6" />}
            title="Secure & Transparent"
            description="Blockchain-powered security with full transaction transparency."
          />
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-12 border border-gray-100">
          <h2 className="text-4xl font-bold text-center mb-12">
            How it <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">works</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Step
              number={1}
              title="Create Your Household"
              description="Sign up and invite your roommates to join your household group."
            />
            <Step
              number={2}
              title="Add Expenses"
              description="Log rent, utilities, groceries, or any shared expense in seconds."
            />
            <Step
              number={3}
              title="Split & Settle"
              description="Expenses are automatically split and settled instantly via your embedded wallet."
            />
          </div>
        </div>
      </main>

      <footer className="mt-32 py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500">
          <p>© 2024 Evenly. Making shared living simpler.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:scale-105">
      <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-accent-100 rounded-xl flex items-center justify-center mb-4 text-primary-600">
        {icon}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function Step({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-400 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold shadow-lg">
        {number}
      </div>
      <h3 className="font-semibold text-xl mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
