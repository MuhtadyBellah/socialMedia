import { Default } from '../../models/default.interface';
export interface Auth {}

export interface AuthResponse {
  default: Default;
  data: {
    token: string;
    tokenType: string;
    expiresIn: number;
    user?: {
      id: number;
      name: string;
      username?: string;
      email: string;
      photo: string;
      cover: string;
    };
  };
}

export interface SuggestedUser {
  name: string;
  handle: string;
  avatar: string;
  followers: number;
}
