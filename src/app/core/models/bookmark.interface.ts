import { DefaultResponse } from './default.interface';

export interface Bookmark {}
export interface BookmarkResponse extends DefaultResponse {
  data: {
    bookmarks: BookmarkData[];
  };
}

export interface BookmarkData {
  _id: string;
  body: string;
  privacy: string;
  user: {
    _id: string;
    name: string;
    username: string;
    photo: string;
  };
  sharedPost: {
    _id: string;
    body: string;
    privacy: string;
    user: {
      _id: string;
      name: string;
      username: string;
      photo: string;
    };
    sharedPost: {};
    likes: [];
    createdAt: string;
    commentsCount: number;
    topComment: {
      _id: string;
      content: string;
      commentCreator: {
        _id: string;
        name: string;
        username: string;
        photo: string;
      };
      post: string;
      parentComment: {};
      likes: [];
      createdAt: string;
    };
    sharesCount: number;
    likesCount: number;
    isShare: boolean;
    id: string;
  };
  likes: [];
  createdAt: string;
  commentsCount: number;
  topComment: {};
  sharesCount: number;
  likesCount: number;
  isShare: boolean;
  id: string;
  bookmarked: boolean;
}
