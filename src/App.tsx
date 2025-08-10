import React, { useState } from 'react';
import WalletConnect from './components/WalletConnect';
import Layout from './components/Layout';
import Home from './components/Home';
import Profile from './components/Profile';
import Messages from './components/Messages';
import Communities from './components/Communities';
import { useAuth } from './hooks/useAuth';

function App() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  if (!isAuthenticated) {
    return <WalletConnect />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'profile':
        return <Profile />;
      case 'messages':
        return <Messages />;
      case 'communities':
        return <Communities />;
      case 'explore':
        return (
          <div className="max-w-4xl mx-auto p-6">
            <div className="text-center py-16 text-gray-400">
              <h2 className="text-2xl font-bold text-white mb-4">Explore</h2>
              <p>Discover new content and users - Coming Soon</p>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="max-w-4xl mx-auto p-6">
            <div className="text-center py-16 text-gray-400">
              <h2 className="text-2xl font-bold text-white mb-4">Notifications</h2>
              <p>Stay updated with your activity - Coming Soon</p>
            </div>
          </div>
        );
      default:
        return <Home />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default App;