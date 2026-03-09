import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DefaultResponse } from '../../models/default.interface';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private readonly api = inject(ApiService);

  getPostComments(postId: string, params?: any): Observable<DefaultResponse> {
    return this.api.get<DefaultResponse>(`posts/${postId}/comments`, {
      page: 1,
      limit: 10,
      ...params,
    });
  }

  postComment(postId: string, data: object): Observable<DefaultResponse> {
    return this.api.post<DefaultResponse>(`posts/${postId}/comments`, data);
  }

  getCommentReplies(postId: string, commentId: string, params?: any): Observable<DefaultResponse> {
    return this.api.get<DefaultResponse>(`posts/${postId}/comments/${commentId}/replies`, {
      page: 1,
      limit: 10,
      ...params,
    });
  }

  postReply(postId: string, commentId: string, data: object): Observable<DefaultResponse> {
    return this.api.post<DefaultResponse>(`posts/${postId}/comments/${commentId}/replies`, data);
  }

  putComment(postId: string, commentId: string, data: object): Observable<DefaultResponse> {
    return this.api.put<DefaultResponse>(`posts/${postId}/comments/${commentId}`, data);
  }

  deleteComment(postId: string, commentId: string): Observable<DefaultResponse> {
    return this.api.delete<DefaultResponse>(`posts/${postId}/comments/${commentId}`);
  }

  putLikeComment(postId: string, commentId: string, data: object): Observable<DefaultResponse> {
    return this.api.put<DefaultResponse>(`posts/${postId}/comments/${commentId}/like`, data);
  }

  putBookmarkPost(postId: string, data: object): Observable<DefaultResponse> {
    return this.api.put<DefaultResponse>(`posts/${postId}/bookmark`, data);
  }

  postShare(postId: string, data: object): Observable<DefaultResponse> {
    return this.api.post<DefaultResponse>(`posts/${postId}/share`, data);
  }
}
