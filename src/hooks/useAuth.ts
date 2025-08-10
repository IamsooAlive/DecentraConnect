import { useState, useEffect } from 'react';
import { User } from '../types';
import { storageService } from '../services/storage';
import { blockchainService } from '../services/blockchain';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const currentUser = storageService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      const { address } = await blockchainService.connectWallet();
      
      // Check if user exists
      const users = storageService.getUsers();
      let existingUser = users.find(u => u.walletAddress === address);
      
      if (!existingUser) {
        // Create new user
        existingUser = await blockchainService.registerUser(address, {
          username: `user_${address.slice(-6)}`,
          displayName: 'New User',
          bio: 'New to BlockConnect',
          avatar: `https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop`,
          coverImage: 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=800'
        });
        
        users.push(existingUser);
        storageService.saveUsers(users);
      }
      
      setUser(existingUser);
      storageService.setCurrentUser(existingUser);
    } catch (error) {
      console.error('Wallet connection failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    setUser(null);
    storageService.clearCurrentUser();
  };

  return {
    user,
    isLoading,
    connectWallet,
    disconnect,
    isAuthenticated: !!user
  };
}