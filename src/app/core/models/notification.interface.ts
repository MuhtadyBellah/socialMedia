import { DefaultResponse } from './default.interface';

export interface Notification {}

export interface NotificationResponse extends DefaultResponse {
  data: {
    notifications: NotificationData[];
  };
}

export interface NotificationData {
  _id: string;
  recipient: {
    _id: string;
    name: string;
    photo: string;
  };
  actor: {
    _id: string;
    name: string;
    photo: string;
  };
  type: string;
  entityType: string;
  entityId: string;
  isRead: boolean;
  createdAt: string;
  entity: {
    _id: string;
    user: string;
    body: string;
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
}
