import { Default } from '../../models/default.interface';
export interface Auth {}

export interface AuthResponse {
  default: Default;
  data: {
    token: string;
    tokenType: string;
    expiresIn: number;
    user?: UserData;
  };
}

export interface UserData {
  _id: string;
  id: string;
  name: string;
  username: string;
  email: string;
  photo: string;
  cover: string;
  dateOfBirth: string;
  gender: string;
  bookmarks: [];
  followers: [];
  following: [];
  createdAt: string;
  passwordChangedAt: string;
  followersCount: 0;
  followingCount: 0;
  bookmarksCount: 0;
}

export interface SuggestedUser {
  name: string;
  handle: string;
  avatar: string;
  followers: number;
}
