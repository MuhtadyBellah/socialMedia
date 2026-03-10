import { DefaultResponse } from './default.interface';

export interface Comment {}

export interface CommentResponse extends DefaultResponse {
  comments: CommentData[];
}

export interface CommentData {
  id: string;
  content: string;
  commentCreator: {
    _id: string;
    name: string;
    username: string;
    photo: string;
    followersCount: number;
    followingCount: number;
    bookmarksCount: number;
    id: string;
  };
  post: string;
  parentComment: {};
  likes: [];
  likesCount: number;
  isReply: boolean;
  createdAt: string;
}

export interface CommentReplyResponse extends DefaultResponse {
  replies: CommentData[];
}
