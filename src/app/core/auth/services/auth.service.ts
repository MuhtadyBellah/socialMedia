import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { AuthResponse } from '../models/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);

  postRegister(data: object): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(environment.baseURL + 'users/signup', data);
  }

  postLogin(data: object): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(environment.baseURL + 'users/signin', data);
  }
}
