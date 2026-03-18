import { NgClass } from '@angular/common';
import { Component, computed, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Paged } from '../../../core/models/default.interface';
import { SuggestionData, SuggestionResponse } from '../../../core/models/suggestion.interface';
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

  mode = input<'sidebar' | 'full'>('full');

  readonly users = signal<SuggestionData[]>([]);
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');
  readonly currentPage = signal(1);
  readonly totalPages = signal(1);
  readonly totalUsers = signal(0);
  readonly nextPage = signal<number | null>(null);
  readonly prevPage = signal<number | null>(null);

  readonly hasUsers = computed(() => this.users().length > 0);
  readonly isEmpty = computed(() => !this.isLoading() && this.users().length === 0);
  readonly hasPrevPage = computed(() => this.prevPage() !== null);
  readonly hasNextPage = computed(() => this.nextPage() !== null);

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers(page: number = 1): void {
    const limit = this.mode() === 'full' ? 20 : 5;

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService
      .getFollowSuggestions(page, limit)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (response: Paged<SuggestionResponse>) => {
          this.users.set(response.data?.suggestions || []);
          this.errorMessage.set('');

          const pagination = response.meta?.pagination;
          if (pagination) {
            this.currentPage.set(pagination.currentPage);
            this.totalPages.set(pagination.numberOfPages);
            this.totalUsers.set(pagination.total);
            this.nextPage.set(pagination.nextPage);
            this.prevPage.set(pagination.prevPage);
          }
        },
        error: () => {
          this.errorMessage.set('Failed to load suggestions. Please try again.');
        },
      });
  }

  goToNextPage(): void {
    const nextPage = this.nextPage();
    if (nextPage) {
      this.loadUsers(nextPage);
    }
  }

  goToPrevPage(): void {
    const prevPage = this.prevPage();
    if (prevPage) {
      this.loadUsers(prevPage);
    }
  }

  back(): void {
    this.router.navigate(['/home']);
  }

  viewMore(): void {
    this.router.navigate(['/suggestions']);
  }

  toggleFollow(userId: string): void {
    this.isLoading.set(true);

    this.authService
      .putFollow(userId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: () => {
          this.loadUsers(this.currentPage());
        },
        error: () => {
          this.errorMessage.set('Failed to follow. Please try again.');
        },
      });
  }
}
