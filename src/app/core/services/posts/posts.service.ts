import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DefaultResponse, Paged } from '../../models/default.interface';
import { PostResponse } from '../../models/post.interface';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly api = inject(ApiService);

  getAllPosts(params?: any): Observable<PostResponse> {
    return this.api.get<PostResponse>('posts', params);
  }

  getFeed(params?: any): Observable<Paged<PostResponse>> {
    return this.api.get<Paged<PostResponse>>('posts/feed', {
      only: 'following',
      page: 1,
      limit: 10,
      ...params,
    });
  }

  postCreate(data: object): Observable<DefaultResponse> {
    return this.api.post<DefaultResponse>('posts', data);
  }

  getSinglePost(postId: string, params?: any): Observable<DefaultResponse> {
    return this.api.get<DefaultResponse>(`posts/${postId}`, params);
  }

  getPostLikes(postId: string, params?: any): Observable<Paged<DefaultResponse>> {
    return this.api.get<Paged<DefaultResponse>>(`posts/${postId}/likes`, {
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

  postShare(postId: string, data: object): Observable<DefaultResponse> {
    return this.api.post<DefaultResponse>(`posts/${postId}/share`, data);
  }
}
