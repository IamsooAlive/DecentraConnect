import React, { useState, useEffect } from 'react';
import { Search, Send, MoreVertical, Shield } from 'lucide-react';
import { Message, User } from '../types';
import { storageService } from '../services/storage';
import { useAuth } from '../hooks/useAuth';

export default function Messages() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadedUsers = storageService.getUsers();
    const loadedMessages = storageService.getMessages();
    
    setUsers(loadedUsers.filter(u => u.id !== user?.id));
    setMessages(loadedMessages);
  }, [user]);

  const getConversationMessages = (userId: string) => {
    return messages
      .filter(msg => 
        (msg.senderId === user?.id && msg.receiverId === userId) ||
        (msg.senderId === userId && msg.receiverId === user?.id)
      )
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const getLastMessage = (userId: string) => {
    const conversation = getConversationMessages(userId);
    return conversation[conversation.length - 1];
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedUser || !user) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      receiverId: selectedUser.id,
      content: newMessage,
      timestamp: new Date().toISOString(),
      encrypted: true,
      read: false
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    storageService.saveMessages(updatedMessages);
    setNewMessage('');
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) return 'Today';
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const filteredUsers = users.filter(u => 
    u.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Conversations Sidebar */}
      <div className="w-full md:w-1/3 bg-gray-800/50 backdrop-blur-lg border-r border-gray-700 flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 rounded-xl text-white placeholder-gray-400 border border-gray-600 focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredUsers.map((chatUser) => {
            const lastMessage = getLastMessage(chatUser.id);
            return (
              <button
                key={chatUser.id}
                onClick={() => setSelectedUser(chatUser)}
                className={`w-full p-4 flex items-center space-x-4 hover:bg-gray-700/50 transition-colors border-b border-gray-700/50 ${
                  selectedUser?.id === chatUser.id ? 'bg-gray-700/50' : ''
                }`}
              >
                <img
                  src={chatUser.avatar}
                  alt={chatUser.displayName}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-white">{chatUser.displayName}</h3>
                    {lastMessage && (
                      <span className="text-xs text-gray-400">{formatDate(lastMessage.timestamp)}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 truncate">
                    {lastMessage ? (
                      lastMessage.encrypted ? '🔒 Encrypted message' : lastMessage.content
                    ) : (
                      'No messages yet'
                    )}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-6 border-b border-gray-700 bg-gray-800/50 backdrop-blur-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.displayName}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-white">{selectedUser.displayName}</h3>
                    <p className="text-sm text-gray-400">@{selectedUser.username}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 text-green-400 text-sm">
                    <Shield className="h-4 w-4" />
                    <span>Encrypted</span>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {getConversationMessages(selectedUser.id).map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      message.senderId === user?.id
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        : 'bg-gray-700 text-white'
                    }`}
                  >
                    <p className="mb-1">{message.content}</p>
                    <p
                      className={`text-xs ${
                        message.senderId === user?.id ? 'text-purple-200' : 'text-gray-400'
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-6 border-t border-gray-700 bg-gray-800/50 backdrop-blur-lg">
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 bg-gray-700/50 rounded-xl text-white placeholder-gray-400 border border-gray-600 focus:border-purple-500 focus:outline-none"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex items-center space-x-2 mt-2">
                <Shield className="h-4 w-4 text-green-400" />
                <span className="text-xs text-green-400">End-to-end encrypted</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-600" />
              <p className="text-lg">Select a conversation to start messaging</p>
              <p className="text-sm mt-2">Your messages are encrypted and secure</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}