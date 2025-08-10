import React from 'react';
import { Wallet, Shield, Zap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function WalletConnect() {
  const { connectWallet, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-full p-4">
              <Wallet className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">BlockConnect</h1>
          <p className="text-gray-300 text-lg">Decentralized Social Network</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Connect Your Wallet
          </h2>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-green-400" />
              <span className="text-gray-300">Your keys, your identity</span>
            </div>
            <div className="flex items-center space-x-3">
              <Zap className="h-5 w-5 text-purple-400" />
              <span className="text-gray-300">Decentralized ownership</span>
            </div>
            <div className="flex items-center space-x-3">
              <Wallet className="h-5 w-5 text-blue-400" />
              <span className="text-gray-300">Secure blockchain authentication</span>
            </div>
          </div>

          <button
            onClick={connectWallet}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Wallet className="h-5 w-5" />
                <span>Connect Wallet</span>
              </>
            )}
          </button>

          <p className="text-gray-400 text-sm text-center mt-4">
            By connecting your wallet, you agree to our terms of service and privacy policy.
          </p>
        </div>

        <div className="text-center text-gray-400 text-sm">
          <p>New to crypto wallets? <a href="#" className="text-purple-400 hover:text-purple-300">Learn more</a></p>
        </div>
      </div>
    </div>
  );
}