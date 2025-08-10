import React, { useState, useEffect } from 'react';
import { Plus, Heart, MessageCircle, Share, Coins, Image, Video, Smile } from 'lucide-react';
import { Post, User } from '../types';
import { storageService } from '../services/storage';
import { useAuth } from '../hooks/useAuth';

export default function Home() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newPost, setNewPost] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);

  useEffect(() => {
    const loadedPosts = storageService.getPosts();
    const loadedUsers = storageService.getUsers();
    setPosts(loadedPosts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    setUsers(loadedUsers);
  }, []);

  const getUserById = (userId: string) => {
    return users.find(u => u.id === userId);
  };

  const createPost = () => {
    if (!newPost.trim() || !user) return;

    const post: Post = {
      id: `post-${Date.now()}`,
      userId: user.id,
      content: newPost,
      images: [],
      timestamp: new Date().toISOString(),
      likes: [],
      comments: [],
      tokens: 0,
      encrypted: false
    };

    const updatedPosts = [post, ...posts];
    setPosts(updatedPosts);
    storageService.savePosts(updatedPosts);
    
    setNewPost('');
    setShowCreatePost(false);
  };

  const toggleLike = (postId: string) => {
    if (!user) return;

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const isLiked = post.likes.includes(user.id);
        const newLikes = isLiked 
          ? post.likes.filter(id => id !== user.id)
          : [...post.likes, user.id];
        
        return { ...post, likes: newLikes };
      }
      return post;
    });

    setPosts(updatedPosts);
    storageService.savePosts(updatedPosts);
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Create Post */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
        <div className="flex items-center space-x-4">
          <img
            src={user?.avatar}
            alt={user?.displayName}
            className="h-12 w-12 rounded-full object-cover"
          />
          <button
            onClick={() => setShowCreatePost(true)}
            className="flex-1 text-left px-4 py-3 bg-gray-700/50 rounded-xl text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            What's happening on the blockchain?
          </button>
        </div>

        {showCreatePost && (
          <div className="mt-4 space-y-4">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full p-4 bg-gray-700/50 rounded-xl text-white placeholder-gray-400 border border-gray-600 focus:border-purple-500 focus:outline-none resize-none"
              rows={4}
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 text-gray-400 hover:text-purple-400 transition-colors">
                  <Image className="h-5 w-5" />
                  <span>Photo</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-400 hover:text-purple-400 transition-colors">
                  <Video className="h-5 w-5" />
                  <span>Video</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-400 hover:text-purple-400 transition-colors">
                  <Smile className="h-5 w-5" />
                  <span>Emoji</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowCreatePost(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createPost}
                  disabled={!newPost.trim()}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map((post) => {
          const postUser = getUserById(post.userId);
          if (!postUser) return null;

          return (
            <div key={post.id} className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
              <div className="flex items-start space-x-4">
                <img
                  src={postUser.avatar}
                  alt={postUser.displayName}
                  className="h-12 w-12 rounded-full object-cover"
                />
                
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-white">{postUser.displayName}</h3>
                        {postUser.verified && (
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">@{postUser.username} · {formatDate(post.timestamp)}</p>
                    </div>
                    
                    {post.tokens > 0 && (
                      <div className="flex items-center space-x-1 text-yellow-400">
                        <Coins className="h-4 w-4" />
                        <span className="text-sm font-medium">{post.tokens}</span>
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

                  <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors ${
                        post.likes.includes(user?.id || '')
                          ? 'text-red-400 bg-red-400/10 hover:bg-red-400/20'
                          : 'text-gray-400 hover:text-red-400 hover:bg-red-400/10'
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${post.likes.includes(user?.id || '') ? 'fill-current' : ''}`} />
                      <span>{post.likes.length}</span>
                    </button>

                    <button className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 transition-colors">
                      <MessageCircle className="h-5 w-5" />
                      <span>{post.comments.length}</span>
                    </button>

                    <button className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-400 hover:text-green-400 hover:bg-green-400/10 transition-colors">
                      <Share className="h-5 w-5" />
                      <span>Share</span>
                    </button>

                    <button className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10 transition-colors">
                      <Coins className="h-5 w-5" />
                      <span>Tip</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}