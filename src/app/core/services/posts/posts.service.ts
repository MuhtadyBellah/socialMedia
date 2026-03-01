import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { AuthResponse } from '../../auth/models/auth.interface';
import { DefaultResponse } from '../../models/default.interface';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly httpClient = inject(HttpClient);

  getAllPosts(data?: any): Observable<DefaultResponse> {
    return this.httpClient.get<any>(environment.baseURL + 'posts', {
      params: data,
    });
  }

  getFeed(data?: any): Observable<DefaultResponse> {
    return this.httpClient.get<any>(environment.baseURL + 'posts/feed', {
      params: { only: 'following', limit: 10, data },
    });
  }

  /**
   * 
   * @param data 
   * Body formdata
      body    Hello Route Academy! @ahmed_ali
      image
   * @returns 
   */
  postCreate(data: object): Observable<DefaultResponse> {
    return this.httpClient.post<any>(environment.baseURL + 'posts', data);
  }

  getSinglePost(postId: string, data?: any): Observable<DefaultResponse> {
    return this.httpClient.get<any>(environment.baseURL + `posts/${postId}`, {
      params: data,
    });
  }

  getPostLikes(postId: string, data?: any): Observable<DefaultResponse> {
    return this.httpClient.get<any>(environment.baseURL + `posts/${postId}/likes`, {
      params: { page: 1, limit: 20, data },
    });
  }

  putPost(data: object): Observable<DefaultResponse> {
    return this.httpClient.put<any>(environment.baseURL + 'posts', data);
  }

  deletePost(data?: any): Observable<DefaultResponse> {
    return this.httpClient.delete<any>(environment.baseURL + 'posts', {
      params: { data },
    });
  }

  putLikePost(postId: string, data: object): Observable<DefaultResponse> {
    return this.httpClient.put<any>(environment.baseURL + `posts/${postId}/like`, data);
  }

  putBookmarkPost(postId: string, data: object): Observable<DefaultResponse> {
    return this.httpClient.put<any>(environment.baseURL + `posts/${postId}/bookmark`, data);
  }

  /**
   * 
   * @param data 
   * {
        "body": "Sharing this great post @mentor_user"
      }
   * @returns 
   */
  postShare(postId: string, data: object): Observable<DefaultResponse> {
    return this.httpClient.post<any>(environment.baseURL + `posts/${postId}/share`, data);
  }
}
