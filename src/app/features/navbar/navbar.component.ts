import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { interval } from 'rxjs';
import { AuthService } from '../../core/services/auth/auth.service';
import { NotificationsService } from '../../core/services/notifications/notifications.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly notificationsService = inject(NotificationsService);
  private readonly authService = inject(AuthService);

  notificationCount = signal<number>(0);
  isProfileDropdownOpen = signal(false);
  isMobileMenuOpen = signal(false);

  readonly currentUser = this.authService.currentUser;

  ngOnInit(): void {
    this.loadNotificationCount();

    interval(30000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.loadNotificationCount());
  }

  private loadNotificationCount(): void {
    this.notificationsService
      .getUnreadCount()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          this.notificationCount.set(response.data?.unreadCount || 0);
        },
        error: () => {
          this.notificationCount.set(0);
        },
      });
  }

  toggleProfileDropdown(): void {
    this.isProfileDropdownOpen.update((v) => !v);
    if (this.isMobileMenuOpen()) {
      this.isMobileMenuOpen.set(false);
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((v) => !v);
    if (this.isProfileDropdownOpen()) {
      this.isProfileDropdownOpen.set(false);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  closeDropdown(): void {
    this.isProfileDropdownOpen.set(false);
  }
}
