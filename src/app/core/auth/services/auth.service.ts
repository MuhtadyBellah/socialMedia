import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { AuthResponse } from '../models/auth.interface';
import { DefaultResponse } from '../../models/default.interface';

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

  /*
    {
      "password": "Aa@123456",
      "newPassword": "Bb@123456"
    }
  */
  patchChangePassword(data: object): Observable<DefaultResponse> {
    return this.api.patch<DefaultResponse>('users/change-password', data);
  }

  getProfileData(params?: any): Observable<DefaultResponse> {
    return this.api.get<DefaultResponse>('users/profile-data', params);
  }

  getBookmarks(params?: any): Observable<DefaultResponse> {
    return this.api.get<DefaultResponse>('users/bookmarks', params);
  }

  getFollowSuggestions(params?: any): Observable<DefaultResponse> {
    return this.api.get<DefaultResponse>('users/suggestions', { limit: 10, ...params });
  }

  getUserProfile(userId: string, params?: any): Observable<DefaultResponse> {
    return this.api.get<DefaultResponse>(`users/${userId}/profile`, params);
  }

  putFollow(userId: string, data: object): Observable<DefaultResponse> {
    return this.api.put<DefaultResponse>(`users/${userId}/follow`, data);
  }

  getUserPosts(userId: string, params?: any): Observable<DefaultResponse> {
    return this.api.get<DefaultResponse>(`users/${userId}/posts`, params);
  }
}
