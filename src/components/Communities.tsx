import React, { useState, useEffect } from 'react';
import { Users, Plus, Lock, Coins, Search, Star } from 'lucide-react';
import { Community, User } from '../types';
import { storageService } from '../services/storage';
import { useAuth } from '../hooks/useAuth';

export default function Communities() {
  const { user } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCommunity, setNewCommunity] = useState({
    name: '',
    description: '',
    private: false,
    tokenGated: false,
    minimumTokens: 0
  });

  useEffect(() => {
    const loadedCommunities = storageService.getCommunities();
    const loadedUsers = storageService.getUsers();
    setCommunities(loadedCommunities);
    setUsers(loadedUsers);
  }, []);

  const getUserById = (userId: string) => {
    return users.find(u => u.id === userId);
  };

  const createCommunity = () => {
    if (!newCommunity.name.trim() || !user) return;

    const community: Community = {
      id: `community-${Date.now()}`,
      ...newCommunity,
      image: 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=300',
      creatorId: user.id,
      members: [user.id],
      posts: []
    };

    const updatedCommunities = [...communities, community];
    setCommunities(updatedCommunities);
    storageService.saveCommunities(updatedCommunities);
    
    setNewCommunity({
      name: '',
      description: '',
      private: false,
      tokenGated: false,
      minimumTokens: 0
    });
    setShowCreateForm(false);
  };

  const joinCommunity = (communityId: string) => {
    if (!user) return;

    const updatedCommunities = communities.map(community => {
      if (community.id === communityId && !community.members.includes(user.id)) {
        if (community.tokenGated && user.tokens < community.minimumTokens) {
          alert(`You need at least ${community.minimumTokens} BCT tokens to join this community`);
          return community;
        }
        return { ...community, members: [...community.members, user.id] };
      }
      return community;
    });

    setCommunities(updatedCommunities);
    storageService.saveCommunities(updatedCommunities);
  };

  const leaveCommunity = (communityId: string) => {
    if (!user) return;

    const updatedCommunities = communities.map(community => {
      if (community.id === communityId) {
        return { ...community, members: community.members.filter(id => id !== user.id) };
      }
      return community;
    });

    setCommunities(updatedCommunities);
    storageService.saveCommunities(updatedCommunities);
  };

  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    community.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-white">Communities</h1>
          <p className="text-gray-400">Discover and join blockchain communities</p>
        </div>
        
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
        >
          <Plus className="h-5 w-5" />
          <span>Create Community</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search communities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-800/50 rounded-xl text-white placeholder-gray-400 border border-gray-600 focus:border-purple-500 focus:outline-none"
        />
      </div>

      {/* Create Community Form */}
      {showCreateForm && (
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Create New Community</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Community Name</label>
              <input
                type="text"
                value={newCommunity.name}
                onChange={(e) => setNewCommunity({ ...newCommunity, name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700/50 rounded-xl text-white placeholder-gray-400 border border-gray-600 focus:border-purple-500 focus:outline-none"
                placeholder="Enter community name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                value={newCommunity.description}
                onChange={(e) => setNewCommunity({ ...newCommunity, description: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700/50 rounded-xl text-white placeholder-gray-400 border border-gray-600 focus:border-purple-500 focus:outline-none resize-none"
                rows={3}
                placeholder="Describe your community"
              />
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newCommunity.private}
                  onChange={(e) => setNewCommunity({ ...newCommunity, private: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-gray-300">Private Community</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newCommunity.tokenGated}
                  onChange={(e) => setNewCommunity({ ...newCommunity, tokenGated: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-gray-300">Token Gated</span>
              </label>
            </div>
            
            {newCommunity.tokenGated && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Minimum Tokens Required</label>
                <input
                  type="number"
                  value={newCommunity.minimumTokens}
                  onChange={(e) => setNewCommunity({ ...newCommunity, minimumTokens: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 bg-gray-700/50 rounded-xl text-white placeholder-gray-400 border border-gray-600 focus:border-purple-500 focus:outline-none"
                  placeholder="0"
                  min="0"
                />
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3 mt-6">
            <button
              onClick={createCommunity}
              disabled={!newCommunity.name.trim()}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Communities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCommunities.map((community) => {
          const creator = getUserById(community.creatorId);
          const isMember = community.members.includes(user?.id || '');
          const canJoin = !community.tokenGated || (user && user.tokens >= community.minimumTokens);
          
          return (
            <div key={community.id} className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-colors">
              <div className="relative h-48">
                <img
                  src={community.image}
                  alt={community.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 flex space-x-2">
                  {community.private && (
                    <div className="bg-gray-900/80 rounded-full p-2">
                      <Lock className="h-4 w-4 text-yellow-400" />
                    </div>
                  )}
                  {community.tokenGated && (
                    <div className="bg-gray-900/80 rounded-full p-2">
                      <Coins className="h-4 w-4 text-green-400" />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{community.name}</h3>
                <p className="text-gray-400 mb-4 line-clamp-2">{community.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">{community.members.length} members</span>
                  </div>
                  
                  {community.tokenGated && (
                    <div className="flex items-center space-x-1 text-green-400">
                      <Coins className="h-4 w-4" />
                      <span className="text-sm">{community.minimumTokens} BCT</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src={creator?.avatar}
                      alt={creator?.displayName}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                    <span className="text-sm text-gray-400">by @{creator?.username}</span>
                  </div>
                  
                  {isMember ? (
                    <button
                      onClick={() => leaveCommunity(community.id)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                    >
                      Leave
                    </button>
                  ) : (
                    <button
                      onClick={() => joinCommunity(community.id)}
                      disabled={!canJoin}
                      className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                        canJoin
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {!canJoin ? `Need ${community.minimumTokens} BCT` : 'Join'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCommunities.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Users className="h-16 w-16 mx-auto mb-4 text-gray-600" />
          <p className="text-lg">No communities found</p>
          <p className="text-sm mt-2">Try adjusting your search or create a new community</p>
        </div>
      )}
    </div>
  );
}