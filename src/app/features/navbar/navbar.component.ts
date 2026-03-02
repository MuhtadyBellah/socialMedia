import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private readonly router = inject(Router);

  // Toggle dropdown menu visibility
  isProfileDropdownOpen = signal(false);
  isMobileMenuOpen = signal(false);

  // Navigation menu items
  navItems = [
    { label: 'Home', route: '/main/home', icon: '🏠' },
    { label: 'Explore', route: '/main/explore', icon: '🔍' },
    { label: 'Bookmarks', route: '/main/bookmarks', icon: '🔖' },
  ];

  // User profile data (you can fetch this from service)
  userProfile = {
    name: 'User Name',
    avatar: '/images/default-profile.png',
  };

  // Notification badge count
  notificationCount = signal(3);
  messageCount = signal(1);

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

  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.isMobileMenuOpen.set(false);
  }

  logout(): void {
    localStorage.removeItem('userToken');
    this.router.navigate(['/auth/login']);
  }

  closeDropdown(): void {
    this.isProfileDropdownOpen.set(false);
  }

  openNotifications(): void {
    this.router.navigate(['/main/notifications']);
    this.notificationCount.set(0);
  }

  openMessages(): void {
    this.router.navigate(['/main/messages']);
    this.messageCount.set(0);
  }
}
