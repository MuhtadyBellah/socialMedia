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
  user: {
    _id: string;
    name: string;
    username: string;
    photo: string;
  };
  sharedPost: PostData | null;
  likes: [];
  createdAt: string;
  commentsCount: number;
  topComment: {};
  sharesCount: number;
  likesCount: number;
  isShare: boolean;
  bookmarked: boolean;
  isLiked: boolean | any;
}
