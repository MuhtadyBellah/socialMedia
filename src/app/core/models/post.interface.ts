import { UserData } from '../auth/models/auth.interface';
import { DefaultResponse } from './default.interface';

export interface Post {}

export interface PostResponse extends DefaultResponse {
  data: {
    posts: PostData[];
  };
}

interface PostData {
  _id: string;
  body: string;
  image: string;
  privacy: string;
  user: Partial<UserData>;
  sharedPost: {};
  likes: [];
  createdAt: string;
  commentsCount: number;
  topComment: {};
  sharesCount: number;
  likesCount: number;
  isShare: boolean;
  bookmarked: boolean;
}
