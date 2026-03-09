import { UserData } from '../auth/models/auth.interface';
import { Default, DefaultResponse } from './default.interface';
export interface Suggestion {}

export interface SuggestionResponse extends DefaultResponse {
  data: {
    suggestions: Partial<UserData>[];
  };
}
