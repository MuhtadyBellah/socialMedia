import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Auth, AuthResponse, UserData } from '../../models/auth.interface';
import { BookmarkResponse } from '../../models/bookmark.interface';
import { DefaultResponse } from '../../models/default.interface';
import { PostResponse } from '../../models/post.interface';
import { SuggestionResponse } from '../../models/suggestion.interface';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly api = inject(ApiService);

  private readonly _currentUser = signal<UserData | null>(null);
  private readonly _isAuthenticated = signal(false);
  private readonly _isLoading = signal(false);

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly userId = computed(() => this._currentUser()?._id || null);

  constructor() {
    this.loadStoredUserData();
  }

  private loadStoredUserData(): void {
    const storedToken = localStorage.getItem(environment.userToken);
    const storedUserData = localStorage.getItem(environment.userData);

    if (storedToken && storedUserData) {
      try {
        const userData = JSON.parse(storedUserData) as UserData;
        this._currentUser.set(userData);
        this._isAuthenticated.set(true);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        this.clearUserData();
      }
    }
  }

  private clearUserData(): void {
    localStorage.removeItem(environment.userToken);
    localStorage.removeItem(environment.userData);
    this._currentUser.set(null);
    this._isAuthenticated.set(false);
  }

  setUserData(token: string, userData: any): void {
    localStorage.setItem(environment.userToken, token);
    localStorage.setItem(environment.userData, JSON.stringify(userData));
    this._currentUser.set(userData);
    this._isAuthenticated.set(true);
  }

  postRegister(data: object): Observable<AuthResponse> {
    this._isLoading.set(true);
    return this.api.post<AuthResponse>('users/signup', data);
  }

  postLogin(data: object): Observable<AuthResponse> {
    this._isLoading.set(true);
    return this.api.post<AuthResponse>('users/signin', data);
  }

  logout(): void {
    this.clearUserData();
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
