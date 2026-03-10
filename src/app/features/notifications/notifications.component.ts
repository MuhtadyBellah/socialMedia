import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationsService } from '../../core/services/notifications/notifications.service';

export interface Notification {
  _id: string;
  type: 'like' | 'comment' | 'follow' | 'share' | 'mention';
  user: {
    _id: string;
    name: string;
    profilePhoto?: string;
  };
  post?: {
    _id: string;
    body: string;
  };
  content: string;
  isRead: boolean;
  createdAt: string;
}

@Component({
  selector: 'app-notifications',
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
})
export class NotificationsComponent implements OnInit {
  private readonly notificationsService = inject(NotificationsService);
  private readonly destroyRef = inject(DestroyRef);

  readonly notifications = signal<Notification[]>([]);
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');
  readonly currentPage = signal(1);
  readonly showLoadMore = signal(false);

  readonly isEmpty = computed(() => !this.isLoading() && this.notifications().length === 0);
  readonly unreadCount = computed(
    () => this.notifications().filter((n: Notification) => !n.isRead).length,
  );

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
      .pipe(takeUntilDestroyed(this.destroyRef))
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
      })
      .add(() => {
        this.isLoading.set(false);
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

    this.notificationsService
      .patchMarkNotification(notificationId, { isRead: true })
      .pipe(takeUntilDestroyed(this.destroyRef))
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

    this.notificationsService
      .patchMarkAll({ isRead: true })
      .pipe(takeUntilDestroyed(this.destroyRef))
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
