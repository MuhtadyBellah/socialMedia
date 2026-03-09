import { DefaultResponse } from './default.interface';

export interface Bookmark {}
export interface BookmarkResponse extends DefaultResponse {
  data: {
    bookmarks: [];
  };
}
