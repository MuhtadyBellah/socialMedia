import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { UserData } from '../../core/models/auth.interface';
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

  notificationCount = signal<number>(0);
  isProfileDropdownOpen = signal(false);
  isMobileMenuOpen = signal(false);

  currentUser: UserData | null = null;

  ngOnInit(): void {
    const storedData = localStorage.getItem(environment.userData);
    if (storedData) {
      try {
        this.currentUser = JSON.parse(storedData);
      } catch (error) {
        console.error('Error parsing user data', error);
        this.currentUser = null;
      }
    }

    this.notificationsService
      .getUnreadCount()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          this.notificationCount.set(response.data.unreadCount | 0);
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
    this.router.navigate(['/auth/login']);
  }

  closeDropdown(): void {
    this.isProfileDropdownOpen.set(false);
  }
}
