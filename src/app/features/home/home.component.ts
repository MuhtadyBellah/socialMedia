import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { UserData } from '../../core/models/auth.interface';
import { PostData } from '../../core/models/post.interface';
import { AuthService } from '../../core/services/auth/auth.service';
import { PostsService } from '../../core/services/posts/posts.service';
import { SuggestedComponent } from '../../shared/components/suggested/suggested.component';
import { FeedComponent } from '../feed/feed.component';

type TabType = 'feed' | 'myPosts' | 'community' | 'saved';

@Component({
  selector: 'app-home',
  imports: [FeedComponent, SuggestedComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private readonly postsService = inject(PostsService);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  readonly posts = signal<PostData[]>([]);
  readonly activeTab = signal<TabType>('feed');
  readonly isLoading = signal(false);
  readonly suggestions = signal<Partial<UserData>[]>([]);
  readonly currentUser = signal<UserData | null>(null);

  readonly hasError = signal(false);
  readonly errorMessage = signal('');

  readonly isEmpty = computed(() => !this.isLoading() && this.posts().length === 0);
  readonly canLoadMore = signal(false);

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadSuggestions();
    this.loadFeed();
  }

  private loadCurrentUser(): void {
    const storedData = localStorage.getItem(environment.userData);
    if (storedData) {
      try {
        const userData = JSON.parse(storedData) as UserData;
        this.currentUser.set(userData);
      } catch (error) {
        console.error('Error parsing user data', error);
        this.currentUser.set(null);
      }
    }
  }

  private loadSuggestions(): void {
    this.authService
      .getFollowSuggestions({ limit: 5 })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.suggestions.set(response.data?.suggestions || []);
        },
        error: () => {
          this.suggestions.set([]);
        },
      });
  }

  loadFeed(): void {
    if (this.isLoading()) return;

    this.activeTab.set('feed');
    this.hasError.set(false);
    this.isLoading.set(true);

    this.postsService
      .getFeed()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (response: any) => {
          this.posts.set(response.data?.posts || []);
          this.hasError.set(false);
        },
        error: () => {
          this.hasError.set(true);
          this.errorMessage.set('Failed to load your feed. Please try again.');
          this.posts.set([]);
        },
      });
  }

  loadMyPosts(): void {
    if (this.isLoading()) return;

    const user = this.currentUser();
    if (!user?._id) {
      this.hasError.set(true);
      this.errorMessage.set('User data not found. Please refresh the page.');
      return;
    }

    this.activeTab.set('myPosts');
    this.hasError.set(false);
    this.isLoading.set(true);

    this.authService
      .getUserPosts(user._id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (response) => {
          this.posts.set(response.data?.posts || []);
          this.hasError.set(false);
        },
        error: () => {
          this.hasError.set(true);
          this.errorMessage.set('Failed to load your posts. Please try again.');
          this.posts.set([]);
        },
      });
  }

  loadALLPosts(): void {
    if (this.isLoading()) return;

    this.activeTab.set('community');
    this.hasError.set(false);
    this.isLoading.set(true);

    this.postsService
      .getAllPosts()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (response: any) => {
          this.posts.set(response.data?.posts || []);
          this.hasError.set(false);
        },
        error: () => {
          this.hasError.set(true);
          this.errorMessage.set('Failed to load community posts. Please try again.');
          this.posts.set([]);
        },
      });
  }

  loadSavedPosts(): void {
    if (this.isLoading()) return;

    this.activeTab.set('saved');
    this.hasError.set(false);
    this.isLoading.set(true);

    this.authService
      .getBookmarks()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (response: any) => {
          this.posts.set(response.data?.posts || []);
          this.hasError.set(false);
        },
        error: () => {
          this.hasError.set(true);
          this.errorMessage.set('Failed to load saved posts. Please try again.');
          this.posts.set([]);
        },
      });
  }

  retryLoad(): void {
    switch (this.activeTab()) {
      case 'feed':
        this.loadFeed();
        break;
      case 'myPosts':
        this.loadMyPosts();
        break;
      case 'community':
        this.loadALLPosts();
        break;
      case 'saved':
        this.loadSavedPosts();
        break;
    }
  }
}
