// Simulated blockchain service for demo purposes
// In production, this would integrate with actual blockchain networks

import { User, Post, Community } from '../types';

class BlockchainService {
  private users = new Map<string, User>();
  private posts = new Map<string, Post>();
  private communities = new Map<string, Community>();

  // Simulate wallet connection
  async connectWallet(): Promise<{ address: string; signature: string }> {
    // Simulate wallet connection delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const address = '0x' + Math.random().toString(16).substring(2, 42);
    const signature = 'sig_' + Math.random().toString(36).substring(2, 15);
    
    return { address, signature };
  }

  // Simulate user registration on blockchain
  async registerUser(walletAddress: string, userData: Omit<User, 'id' | 'walletAddress'>): Promise<User> {
    const user: User = {
      id: this.generateId(),
      walletAddress,
      ...userData,
      followers: [],
      following: [],
      tokens: 100, // Starting tokens
      joinDate: new Date().toISOString(),
      verified: false
    };

    this.users.set(user.id, user);
    return user;
  }

  // Simulate post creation with content ownership
  async createPost(userId: string, postData: Omit<Post, 'id' | 'userId' | 'timestamp' | 'likes' | 'comments' | 'tokens'>): Promise<Post> {
    const post: Post = {
      id: this.generateId(),
      userId,
      ...postData,
      timestamp: new Date().toISOString(),
      likes: [],
      comments: [],
      tokens: 0
    };

    this.posts.set(post.id, post);
    return post;
  }

  // Simulate token rewards for content
  async rewardTokens(userId: string, amount: number): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.tokens += amount;
      this.users.set(userId, user);
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  // Get user data
  getUser(id: string): User | undefined {
    return this.users.get(id);
  }

  // Get post data
  getPost(id: string): Post | undefined {
    return this.posts.get(id);
  }

  // Get all users
  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  // Get all posts
  getAllPosts(): Post[] {
    return Array.from(this.posts.values());
  }
}

export const blockchainService = new BlockchainService();