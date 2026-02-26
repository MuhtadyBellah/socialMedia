import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const API_URL = 'https://route-posts.routemisr.com/';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);

  postRegister(data: Object): Observable<any> {
    return this.httpClient.post<any>(API_URL + 'users/signup', data);
  }

  postLogin(data: Object): Observable<any> {
    return this.httpClient.post<any>(API_URL + 'users/signin', data);
  }
}
