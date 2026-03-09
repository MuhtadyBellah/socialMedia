import { DefaultResponse } from './default.interface';

export interface Notification {}

export interface NotificationResponse extends DefaultResponse {
  data: {
    notifications: [];
  };
}
