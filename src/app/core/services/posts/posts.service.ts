import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { DefaultResponse } from '../../models/default.interface';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly api = inject(ApiService);

  getAllPosts(params?: any): Observable<DefaultResponse> {
    return this.api.get<DefaultResponse>('posts', params);
  }

  getFeed(params?: any): Observable<DefaultResponse> {
    return this.api.get<DefaultResponse>('posts/feed', { only: 'following', limit: 10, ...params });
  }

  /**
   * Create a new post
   * @param data FormData with body (text content, supports @mentions) and optional image
   */
  postCreate(data: object): Observable<DefaultResponse> {
    return this.api.post<DefaultResponse>('posts', data);
  }

  getSinglePost(postId: string, params?: any): Observable<DefaultResponse> {
    return this.api.get<DefaultResponse>(`posts/${postId}`, params);
  }

  getPostLikes(postId: string, params?: any): Observable<DefaultResponse> {
    return this.api.get<DefaultResponse>(`posts/${postId}/likes`, {
      page: 1,
      limit: 20,
      ...params,
    });
  }

  putPost(data: object): Observable<DefaultResponse> {
    return this.api.put<DefaultResponse>('posts', data);
  }

  deletePost(params?: any): Observable<DefaultResponse> {
    return this.api.delete<DefaultResponse>('posts');
  }

  putLikePost(postId: string, data: object): Observable<DefaultResponse> {
    return this.api.put<DefaultResponse>(`posts/${postId}/like`, data);
  }

  putBookmarkPost(postId: string, data: object): Observable<DefaultResponse> {
    return this.api.put<DefaultResponse>(`posts/${postId}/bookmark`, data);
  }

  /**
   * Share a post
   * @param postId The post to share
   * @param data Body with optional text content
   */
  postShare(postId: string, data: object): Observable<DefaultResponse> {
    return this.api.post<DefaultResponse>(`posts/${postId}/share`, data);
  }
}
