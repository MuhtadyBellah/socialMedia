import { Component, DestroyRef, inject, OnInit, signal, computed } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment.development';
import { NotificationsService } from '../../core/services/notifications/notifications.service';
import { UserData } from '../../core/auth/models/auth.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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

  notificationCount: number = 0;
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
          this.notificationCount = response.data.unreadCount | 0;
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
