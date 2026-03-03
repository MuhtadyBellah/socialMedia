import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment.development';

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

  logout(): void {
    localStorage.removeItem(environment.userToken);
    this.router.navigate(['/auth/login']);
  }

  closeDropdown(): void {
    this.isProfileDropdownOpen.set(false);
  }
}
