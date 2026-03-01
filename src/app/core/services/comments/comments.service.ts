import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { DefaultResponse } from '../../models/default.interface';

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

  /**
   * Create a comment on a post
   * @param postId The post ID
   * @param data FormData with content (supports @mentions) and optional image
   */
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

  /**
   * Create a reply to a comment
   * @param postId The post ID
   * @param commentId The comment ID
   * @param data FormData with content and optional image
   */
  postReply(postId: string, commentId: string, data: object): Observable<DefaultResponse> {
    return this.api.post<DefaultResponse>(`posts/${postId}/comments/${commentId}/replies`, data);
  }

  /**
   * Update a comment
   * @param postId The post ID
   * @param commentId The comment ID
   * @param data FormData with updated content and optional image
   */
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

  /**
   * Share a post
   * @param postId The post to share
   * @param data Body with optional text content
   */
  postShare(postId: string, data: object): Observable<DefaultResponse> {
    return this.api.post<DefaultResponse>(`posts/${postId}/share`, data);
  }
}
