import { DefaultResponse } from './default.interface';
export interface Suggestion {}

export interface SuggestionResponse extends DefaultResponse {
  data: {
    suggestions: SuggestionData[];
  };
}

export interface SuggestionData {
  _id: string;
  name: string;
  username: string;
  photo: string;
  mutualFollowersCount: number;
  followersCount: number;
}
