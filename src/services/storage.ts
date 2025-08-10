// Local storage service for demo data persistence
import { User, Post, Message, Community, Notification } from '../types';

class StorageService {
  private readonly KEYS = {
    CURRENT_USER: 'blockconnect_current_user',
    USERS: 'blockconnect_users',
    POSTS: 'blockconnect_posts',
    MESSAGES: 'blockconnect_messages',
    COMMUNITIES: 'blockconnect_communities',
    NOTIFICATIONS: 'blockconnect_notifications'
  };

  // User management
  setCurrentUser(user: User): void {
    localStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(user));
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem(this.KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  }

  clearCurrentUser(): void {
    localStorage.removeItem(this.KEYS.CURRENT_USER);
  }

  // Users
  saveUsers(users: User[]): void {
    localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
  }

  getUsers(): User[] {
    const users = localStorage.getItem(this.KEYS.USERS);
    return users ? JSON.parse(users) : this.getDefaultUsers();
  }

  // Posts
  savePosts(posts: Post[]): void {
    localStorage.setItem(this.KEYS.POSTS, JSON.stringify(posts));
  }

  getPosts(): Post[] {
    const posts = localStorage.getItem(this.KEYS.POSTS);
    return posts ? JSON.parse(posts) : this.getDefaultPosts();
  }

  // Messages
  saveMessages(messages: Message[]): void {
    localStorage.setItem(this.KEYS.MESSAGES, JSON.stringify(messages));
  }

  getMessages(): Message[] {
    const messages = localStorage.getItem(this.KEYS.MESSAGES);
    return messages ? JSON.parse(messages) : [];
  }

  // Communities
  saveCommunities(communities: Community[]): void {
    localStorage.setItem(this.KEYS.COMMUNITIES, JSON.stringify(communities));
  }

  getCommunities(): Community[] {
    const communities = localStorage.getItem(this.KEYS.COMMUNITIES);
    return communities ? JSON.parse(communities) : this.getDefaultCommunities();
  }

  // Notifications
  saveNotifications(notifications: Notification[]): void {
    localStorage.setItem(this.KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }

  getNotifications(): Notification[] {
    const notifications = localStorage.getItem(this.KEYS.NOTIFICATIONS);
    return notifications ? JSON.parse(notifications) : [];
  }

  private getDefaultUsers(): User[] {
    return [
      {
        id: 'user-1',
        walletAddress: '0x1234567890abcdef',
        username: 'cryptodev',
        displayName: 'Alex Chen',
        bio: 'Blockchain developer & DeFi enthusiast. Building the future of decentralized web.',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        coverImage: 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=800',
        followers: ['user-2'],
        following: ['user-2', 'user-3'],
        tokens: 1250,
        joinDate: '2024-01-15T10:00:00Z',
        verified: true
      },
      {
        id: 'user-2',
        walletAddress: '0xfedcba0987654321',
        username: 'web3artist',
        displayName: 'Maya Rodriguez',
        bio: 'Digital artist exploring NFTs and blockchain creativity. Creating art for the metaverse.',
        avatar: 'https://images.pexels.com/photos/2169434/pexels-photo-2169434.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        coverImage: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=800',
        followers: ['user-1', 'user-3'],
        following: ['user-1'],
        tokens: 890,
        joinDate: '2024-01-20T14:30:00Z',
        verified: true
      },
      {
        id: 'user-3',
        walletAddress: '0x9876543210abcdef',
        username: 'defitrader',
        displayName: 'Jordan Kim',
        bio: 'DeFi trader and yield farmer. Sharing insights about decentralized finance.',
        avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        coverImage: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800',
        followers: ['user-2'],
        following: ['user-1', 'user-2'],
        tokens: 2100,
        joinDate: '2024-01-10T08:15:00Z',
        verified: false
      }
    ];
  }

  private getDefaultPosts(): Post[] {
    return [
      {
        id: 'post-1',
        userId: 'user-1',
        content: 'Just deployed my first smart contract on the testnet! The future of decentralized applications is here. Building something amazing with #BlockConnect 🚀',
        images: ['https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=600'],
        timestamp: '2024-01-25T15:30:00Z',
        likes: ['user-2', 'user-3'],
        comments: [
          {
            id: 'comment-1',
            userId: 'user-2',
            postId: 'post-1',
            content: 'Amazing work! Love seeing the blockchain community grow',
            timestamp: '2024-01-25T16:00:00Z',
            likes: ['user-1']
          }
        ],
        tokens: 25,
        encrypted: false
      },
      {
        id: 'post-2',
        userId: 'user-2',
        content: 'New digital art collection dropping soon! Each piece will be minted as an NFT on the blockchain. Art meets technology 🎨✨',
        images: ['https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=600'],
        timestamp: '2024-01-25T12:15:00Z',
        likes: ['user-1'],
        comments: [],
        tokens: 15,
        encrypted: false
      },
      {
        id: 'post-3',
        userId: 'user-3',
        content: 'Market analysis: DeFi yields are looking promising this week. Always DYOR and manage your risk. What protocols are you watching? 📈',
        images: [],
        timestamp: '2024-01-25T09:45:00Z',
        likes: ['user-1', 'user-2'],
        comments: [
          {
            id: 'comment-2',
            userId: 'user-1',
            postId: 'post-3',
            content: 'Thanks for the insights! Been watching Aave closely',
            timestamp: '2024-01-25T10:30:00Z',
            likes: ['user-3']
          }
        ],
        tokens: 30,
        encrypted: false
      }
    ];
  }

  private getDefaultCommunities(): Community[] {
    return [
      {
        id: 'community-1',
        name: 'Blockchain Developers',
        description: 'A community for blockchain developers to share knowledge and collaborate',
        image: 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=300',
        creatorId: 'user-1',
        members: ['user-1', 'user-2', 'user-3'],
        posts: ['post-1'],
        private: false,
        tokenGated: true,
        minimumTokens: 100
      },
      {
        id: 'community-2',
        name: 'NFT Artists',
        description: 'Digital artists creating and trading NFTs',
        image: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=300',
        creatorId: 'user-2',
        members: ['user-1', 'user-2'],
        posts: ['post-2'],
        private: false,
        tokenGated: false,
        minimumTokens: 0
      }
    ];
  }
}

export const storageService = new StorageService();