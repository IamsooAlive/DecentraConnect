export interface User {
  id: string;
  walletAddress: string;
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  coverImage: string;
  followers: string[];
  following: string[];
  tokens: number;
  joinDate: string;
  verified: boolean;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  images: string[];
  timestamp: string;
  likes: string[];
  comments: Comment[];
  tokens: number;
  encrypted: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  postId: string;
  content: string;
  timestamp: string;
  likes: string[];
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  encrypted: boolean;
  read: boolean;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  image: string;
  creatorId: string;
  members: string[];
  posts: string[];
  private: boolean;
  tokenGated: boolean;
  minimumTokens: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'follow' | 'message' | 'token';
  content: string;
  timestamp: string;
  read: boolean;
  actionUserId?: string;
}