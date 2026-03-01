import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { DefaultResponse } from '../../models/default.interface';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private readonly httpClient = inject(HttpClient);

  getPostComments(postId: string, data?: any): Observable<DefaultResponse> {
    return this.httpClient.get<any>(environment.baseURL + `posts/${postId}/comments`, {
      params: { page: 1, limit: 10, data },
    });
  }

  /**
   * 
   * @param data 
   * Body formdata
      content     Nice post @ahmed_ali
      image
   * @returns 
   */
  postComment(postId: string, data: object): Observable<DefaultResponse> {
    return this.httpClient.post<any>(environment.baseURL + `posts/${postId}/comments`, data);
  }

  getCommentReplies(postId: string, commentId: string, data?: any): Observable<DefaultResponse> {
    return this.httpClient.get<any>(
      environment.baseURL + `posts/${postId}/comments/${commentId}/replies`,
      {
        params: { page: 1, limit: 10, data },
      },
    );
  }

  /**
   * 
   * @param data 
   * Body formdata
      content     Reply with mention @mentor_user
      image
   * @returns 
   */
  postReply(postId: string, commentId: string, data: object): Observable<DefaultResponse> {
    return this.httpClient.post<any>(
      environment.baseURL + `posts/${postId}/comments/${commentId}/replies`,
      data,
    );
  }

  /**
   * 
   * @param data 
   * Body formdata
      content     Updated comment text
      image
   * @returns 
   */
  putComment(postId: string, commentId: string, data: object): Observable<DefaultResponse> {
    return this.httpClient.put<any>(
      environment.baseURL + `posts/${postId}/comments/${commentId}`,
      data,
    );
  }

  deleteComment(postId: string, commentId: string, data?: any): Observable<DefaultResponse> {
    return this.httpClient.delete<any>(
      environment.baseURL + `posts/${postId}/comments/${commentId}`,
      {
        params: { data },
      },
    );
  }

  putLikeComment(postId: string, commentId: string, data: object): Observable<DefaultResponse> {
    return this.httpClient.put<any>(
      environment.baseURL + `posts/${postId}/comments/${commentId}/like`,
      data,
    );
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
