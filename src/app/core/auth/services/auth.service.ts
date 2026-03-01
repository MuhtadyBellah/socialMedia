import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { AuthResponse } from '../models/auth.interface';
import { DefaultResponse } from '../../models/default.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    const token = localStorage.getItem('userToken');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  postRegister(data: object): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(environment.baseURL + 'users/signup', data);
  }

  postLogin(data: object): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(environment.baseURL + 'users/signin', data);
  }

  /*
    {
      "password": "Aa@123456",
      "newPassword": "Bb@123456"
    }
  */
  patchChangePassword(data: object): Observable<DefaultResponse> {
    return this.httpClient.patch<any>(environment.baseURL + 'users/change-password', data, {
      headers: this.getHeaders(),
    });
  }

  getProfileData(data?: any): Observable<DefaultResponse> {
    return this.httpClient.get<any>(environment.baseURL + 'users/profile-data', {
      headers: this.getHeaders(),
      params: data,
    });
  }

  getBookmarks(data?: any): Observable<DefaultResponse> {
    return this.httpClient.get<any>(environment.baseURL + 'users/bookmarks', {
      headers: this.getHeaders(),
      params: data,
    });
  }

  getFollowSuggestions(data?: any): Observable<DefaultResponse> {
    return this.httpClient.get<any>(environment.baseURL + 'users/suggestions', {
      headers: this.getHeaders(),
      params: { limit: 10, data },
    });
  }

  getUserProfile(userId: string, data?: any): Observable<DefaultResponse> {
    return this.httpClient.get<any>(environment.baseURL + `users/${userId}/profile`, {
      headers: this.getHeaders(),
      params: { data },
    });
  }

  putFollow(userId: string, data: object): Observable<DefaultResponse> {
    return this.httpClient.put<any>(environment.baseURL + `users/${userId}/follow`, data, {
      headers: this.getHeaders(),
    });
  }

  getUserPosts(userId: string, data?: any): Observable<DefaultResponse> {
    return this.httpClient.get<any>(environment.baseURL + `users/${userId}/posts`, {
      headers: this.getHeaders(),
      params: { data },
    });
  }
}
