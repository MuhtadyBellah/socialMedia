import { Default, DefaultResponse } from './default.interface';

export interface Post {}

export interface PostResponse {
  default: DefaultResponse;
  data: {
    posts: [];
  };
}
