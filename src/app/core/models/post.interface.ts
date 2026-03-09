import { UserData } from './auth.interface';
import { DefaultResponse } from './default.interface';

export interface Post {}

export interface PostResponse extends DefaultResponse {
  data: {
    posts: PostData[];
  };
}

export interface PostData {
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
