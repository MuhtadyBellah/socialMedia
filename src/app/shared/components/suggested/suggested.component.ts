import { NgClass } from '@angular/common';
import { Component, computed, DestroyRef, inject, Input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { SuggestionData } from '../../../core/models/suggestion.interface';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-suggested',
  imports: [NgClass, RouterLink],
  templateUrl: './suggested.component.html',
  styleUrl: './suggested.component.css',
})
export class SuggestedComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  @Input() mode: 'sidebar' | 'full' = 'full';

  readonly users = signal<SuggestionData[]>([]);
  readonly isLoading = signal(false);
  readonly followingUsers = signal<Set<string>>(new Set());
  readonly errorMessage = signal('');

  readonly hasUsers = computed(() => this.users().length > 0);
  readonly isEmpty = computed(() => !this.isLoading() && this.users().length === 0);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService
      .getFollowSuggestions({ limit: 5 })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.users.set(response.data?.suggestions || []);
          this.errorMessage.set('');
        },
        error: (error) => {
          this.users.set([]);
          this.errorMessage.set('Failed to load suggestions. Please try again.');
        },
      })
      .add(() => {
        this.isLoading.set(false);
      });
  }

  viewMore(): void {
    if (this.mode === 'sidebar') {
      this.router.navigate(['/suggestions']);
    }
  }

  followUser(userId: string): void {
    if (!userId || this.followingUsers().has(userId) || this.isLoading()) return;

    this.followingUsers.update((users) => new Set(users).add(userId));

    this.authService
      .putFollow(userId, {})
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {},
        error: () => {
          this.followingUsers.update((users) => {
            const newSet = new Set(users);
            newSet.delete(userId);
            return newSet;
          });
        },
      });
  }

  unfollowUser(userId: string): void {
    if (!userId || !this.followingUsers().has(userId) || this.isLoading()) return;

    this.followingUsers.update((users) => {
      const newSet = new Set(users);
      newSet.delete(userId);
      return newSet;
    });

    this.authService
      .putFollow(userId, {})
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {},
        error: () => {
          this.followingUsers.update((users) => new Set(users).add(userId));
        },
      });
  }

  isFollowing(userId: string): boolean {
    return this.followingUsers().has(userId);
  }

  toggleFollow(userId: string): void {
    if (this.isFollowing(userId)) {
      this.unfollowUser(userId);
    } else {
      this.followUser(userId);
    }
  }
}
