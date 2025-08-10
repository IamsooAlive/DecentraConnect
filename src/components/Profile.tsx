import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Link as LinkIcon, Edit, Users, Heart, MessageCircle, Coins } from 'lucide-react';
import { Post, User } from '../types';
import { storageService } from '../services/storage';
import { useAuth } from '../hooks/useAuth';

export default function Profile() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [userPosts, setUserPosts] = useState<Post[]>([]);

  useEffect(() => {
    const loadedPosts = storageService.getPosts();
    setPosts(loadedPosts);
    
    if (user) {
      const filteredPosts = loadedPosts
        .filter(post => post.userId === user.id)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setUserPosts(filteredPosts);
    }
  }, [user]);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  const formatPostDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Cover Image */}
      <div className="h-48 md:h-64 bg-gradient-to-r from-purple-600 to-blue-600 relative">
        <img
          src={user.coverImage}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Profile Info */}
      <div className="bg-gray-800/50 backdrop-blur-lg border-x border-b border-gray-700 px-6 pb-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 mb-6">
          <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-6">
            <img
              src={user.avatar}
              alt={user.displayName}
              className="h-32 w-32 rounded-full border-4 border-gray-800 object-cover"
            />
            
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                <h1 className="text-2xl font-bold text-white">{user.displayName}</h1>
                {user.verified && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <p className="text-gray-400 mb-1">@{user.username}</p>
              <p className="text-gray-300 max-w-md">{user.bio}</p>
            </div>
          </div>

          <button className="flex items-center space-x-2 px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors">
            <Edit className="h-4 w-4" />
            <span>Edit Profile</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm mb-6">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>Joined {formatDate(user.joinDate)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Coins className="h-4 w-4 text-yellow-400" />
            <span className="text-yellow-400 font-medium">{user.tokens} BCT</span>
          </div>
        </div>

        <div className="flex space-x-8 text-sm">
          <div className="flex items-center space-x-1">
            <span className="font-semibold text-white">{user.following.length}</span>
            <span className="text-gray-400">Following</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="font-semibold text-white">{user.followers.length}</span>
            <span className="text-gray-400">Followers</span>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="bg-gray-800/50 backdrop-blur-lg border-x border-gray-700">
        <div className="flex space-x-8 px-6">
          {[
            { id: 'posts', label: 'Posts', count: userPosts.length },
            { id: 'media', label: 'Media', count: userPosts.filter(p => p.images.length > 0).length },
            { id: 'likes', label: 'Likes', count: userPosts.reduce((sum, p) => sum + p.likes.length, 0) }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="border-x border-b border-gray-700 bg-gray-900">
        {activeTab === 'posts' && (
          <div className="space-y-0">
            {userPosts.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p>No posts yet</p>
              </div>
            ) : (
              userPosts.map((post) => (
                <div key={post.id} className="p-6 border-b border-gray-700 hover:bg-gray-800/20 transition-colors">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-gray-400 text-sm">{formatPostDate(post.timestamp)}</p>
                      {post.tokens > 0 && (
                        <div className="flex items-center space-x-1 text-yellow-400">
                          <Coins className="h-4 w-4" />
                          <span className="text-sm font-medium">{post.tokens} BCT</span>
                        </div>
                      )}
                    </div>

                    <p className="text-white text-lg leading-relaxed">{post.content}</p>

                    {post.images.length > 0 && (
                      <div className="grid grid-cols-1 gap-3">
                        {post.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt="Post content"
                            className="w-full h-96 object-cover rounded-xl"
                          />
                        ))}
                      </div>
                    )}

                    <div className="flex items-center space-x-8 text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4" />
                        <span>{post.likes.length}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.comments.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'media' && (
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {userPosts
                .filter(post => post.images.length > 0)
                .map((post) => 
                  post.images.map((image, index) => (
                    <div key={`${post.id}-${index}`} className="aspect-square">
                      <img
                        src={image}
                        alt="Media"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                  ))
                )}
            </div>
            {userPosts.filter(p => p.images.length > 0).length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <p>No media posts yet</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'likes' && (
          <div className="text-center py-16 text-gray-400">
            <p>Liked posts feature coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}