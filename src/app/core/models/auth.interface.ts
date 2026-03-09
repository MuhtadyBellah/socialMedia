import { Default, DefaultResponse } from './default.interface';
export interface Auth extends DefaultResponse {
  data: {
    isFollowing: boolean;
    user: UserData;
  };
}

export interface AuthResponse extends DefaultResponse {
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
