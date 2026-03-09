import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { Auth, AuthResponse, UserData } from '../models/auth.interface';
import { DefaultResponse } from '../../models/default.interface';
import { BookmarkResponse } from '../../models/bookmark.interface';
import { PostResponse } from '../../models/post.interface';
import { SuggestionResponse } from '../../models/suggestion.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly api = inject(ApiService);

  postRegister(data: object): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('users/signup', data);
  }

  postLogin(data: object): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('users/signin', data);
  }

  patchChangePassword(data: object): Observable<AuthResponse> {
    return this.api.patch<AuthResponse>('users/change-password', data);
  }

  putUploadProfilePhoto(data: FormData): Observable<DefaultResponse> {
    return this.api.put<DefaultResponse>('users/upload-photo', data);
  }

  getProfileData(params?: any): Observable<Auth> {
    return this.api.get<Auth>('users/profile-data', params);
  }

  getBookmarks(params?: any): Observable<BookmarkResponse> {
    return this.api.get<BookmarkResponse>('users/bookmarks', params);
  }

  getFollowSuggestions(params?: any): Observable<SuggestionResponse> {
    return this.api.get<SuggestionResponse>('users/suggestions', { limit: 10, ...params });
  }

  getUserProfile(userId: string, params?: any): Observable<Auth> {
    return this.api.get<Auth>(`users/${userId}/profile`, params);
  }

  putFollow(userId: string, data: object): Observable<DefaultResponse> {
    return this.api.put<DefaultResponse>(`users/${userId}/follow`, data);
  }

  getUserPosts(userId: string, params?: any): Observable<PostResponse> {
    return this.api.get<PostResponse>(`users/${userId}/posts`, params);
  }
}
