import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { DefaultResponse } from '../../models/default.interface';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private readonly httpClient = inject(HttpClient);

  getNotifications(data?: any): Observable<DefaultResponse> {
    return this.httpClient.get<any>(environment.baseURL + 'notifications', {
      params: { unread: false, page: 1, limit: 10, data },
    });
  }

  getUnreadCount(data?: any): Observable<DefaultResponse> {
    return this.httpClient.get<any>(environment.baseURL + 'notifications/unread-count', {
      params: { data },
    });
  }

  patchMarkNotification(notificationId: string, data: object): Observable<DefaultResponse> {
    return this.httpClient.patch<any>(
      environment.baseURL + `notifications/${notificationId}/read`,
      data,
    );
  }

  patchMarkAll(data: object): Observable<DefaultResponse> {
    return this.httpClient.patch<any>(environment.baseURL + 'notifications/read-all', data);
  }
}
