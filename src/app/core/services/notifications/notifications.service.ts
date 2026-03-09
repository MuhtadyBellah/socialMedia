import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { DefaultResponse, Paged } from '../../models/default.interface';
import { NotificationResponse } from '../../models/notification.interface';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private readonly api = inject(ApiService);

  getNotifications(params?: any): Observable<Paged<NotificationResponse>> {
    return this.api.get<Paged<NotificationResponse>>('notifications', {
      unread: false,
      page: 1,
      limit: 10,
      ...params,
    });
  }

  getUnreadCount(params?: any): Observable<DefaultResponse> {
    return this.api.get<DefaultResponse>('notifications/unread-count', params);
  }

  patchMarkNotification(notificationId: string, data: object): Observable<DefaultResponse> {
    return this.api.patch<DefaultResponse>(`notifications/${notificationId}/read`, data);
  }

  patchMarkAll(data: object): Observable<DefaultResponse> {
    return this.api.patch<DefaultResponse>('notifications/read-all', data);
  }
}
