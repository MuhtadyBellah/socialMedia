import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { NotificationData } from '../../core/models/notification.interface';
import { NotificationsService } from '../../core/services/notifications/notifications.service';

@Component({
  selector: 'app-notifications',
  imports: [CommonModule, RouterLink],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
})
export class NotificationsComponent implements OnInit {
  private readonly notificationsService = inject(NotificationsService);
  private readonly destroyRef = inject(DestroyRef);

  readonly notifications = signal<NotificationData[]>([]);
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');
  readonly currentPage = signal(1);
  readonly showLoadMore = signal(false);

  readonly isEmpty = computed(() => !this.isLoading() && this.notifications().length === 0);
  readonly unreadCount = computed(() => this.notifications().filter((n) => !n.isRead).length);

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(page: number = 1): void {
    if (this.isLoading()) return;

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.currentPage.set(page);

    this.notificationsService
      .getNotifications({ page, limit: 20 })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (response: any) => {
          const newNotifications = response.data?.notifications || [];

          if (page === 1) {
            this.notifications.set(newNotifications);
          } else {
            this.notifications.set([...this.notifications(), ...newNotifications]);
          }

          this.showLoadMore.set(newNotifications.length === 20);
          this.errorMessage.set('');
        },
        error: (error) => {
          this.errorMessage.set('Failed to load notifications. Please try again.');
          this.showLoadMore.set(false);
        },
      });
  }

  loadMoreNotifications(): void {
    this.loadNotifications(this.currentPage() + 1);
  }

  retryLoad(): void {
    this.loadNotifications(1);
  }

  markAsRead(notificationId: string): void {
    this.notifications.update((notifications) =>
      notifications.map((notification) =>
        notification._id === notificationId ? { ...notification, isRead: true } : notification,
      ),
    );

    this.isLoading.set(true);

    this.notificationsService
      .patchMarkNotification(notificationId, { isRead: true })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        error: () => {
          this.notifications.update((notifications) =>
            notifications.map((notification) =>
              notification._id === notificationId
                ? { ...notification, isRead: false }
                : notification,
            ),
          );
        },
      });
  }

  markAllAsRead(): void {
    if (this.unreadCount() === 0 || this.isLoading()) return;

    this.notifications.update((notifications) =>
      notifications.map((notification) => ({ ...notification, isRead: true })),
    );

    this.isLoading.set(true);

    this.notificationsService
      .patchMarkAll({ isRead: true })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        error: () => {
          this.loadNotifications();
        },
      });
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'like':
        return '❤️';
      case 'comment':
        return '💬';
      case 'follow':
        return '👤';
      case 'share':
        return '🔄';
      case 'mention':
        return '@';
      default:
        return '🔔';
    }
  }

  getNotificationMessage(notification: NotificationData): string {
    switch (notification.type) {
      case 'like':
        return 'Someone liked your post';
      case 'comment':
        return 'Someone commented on your post';
      case 'follow':
        return 'Someone followed you';
      case 'share':
        return 'Someone shared your post';
      case 'mention':
        return 'Someone mentioned you in a post';
      default:
        return 'You have a new notification';
    }
  }

  getNotificationUrl(notification: NotificationData): string[] | null {
    if (!notification.entity) return null;

    switch (notification.entityType) {
      case 'post':
        return ['/post', notification.entity._id];
      case 'comment':
        return ['/post', notification.entity.user];
      case 'user':
        return ['/profile', notification.entity._id];
      default:
        return ['/post', notification.entity._id];
    }
  }

  getTimeAgo(createdAt: string): string {
    if (!createdAt) return 'now';

    const now = new Date();
    const notificationDate = new Date(createdAt);

    if (isNaN(notificationDate.getTime())) return 'unknown';

    const secondsAgo = Math.floor((now.getTime() - notificationDate.getTime()) / 1000);

    if (secondsAgo < 60) return `${secondsAgo}s`;
    if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)}m`;
    if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)}h`;
    if (secondsAgo < 604800) return `${Math.floor(secondsAgo / 86400)}d`;

    return notificationDate.toLocaleDateString();
  }
}
