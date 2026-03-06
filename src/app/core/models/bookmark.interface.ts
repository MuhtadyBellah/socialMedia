import { DefaultResponse } from './default.interface';

export interface Bookmark {}
export interface BookmarkResponse {
  default: DefaultResponse;
  data: {
    bookmarks: [];
  };
}
