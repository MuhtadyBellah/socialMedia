import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommentReplyResponse, CommentResponse } from '../../models/comment.interface';
import { DefaultResponse } from '../../models/default.interface';
import { ApiService } from '../api.service';
import { Paged } from './../../models/default.interface';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private readonly api = inject(ApiService);

  getPostComments(postId: string, params?: any): Observable<Paged<CommentResponse>> {
    return this.api.get<Paged<CommentResponse>>(`posts/${postId}/comments`, {
      page: 1,
      limit: 10,
      ...params,
    });
  }

  postComment(postId: string, data: object): Observable<DefaultResponse> {
    return this.api.post<DefaultResponse>(`posts/${postId}/comments`, data);
  }

  getCommentReplies(
    postId: string,
    commentId: string,
    params?: any,
  ): Observable<Paged<CommentReplyResponse>> {
    return this.api.get<Paged<CommentReplyResponse>>(
      `posts/${postId}/comments/${commentId}/replies`,
      {
        page: 1,
        limit: 10,
        ...params,
      },
    );
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
