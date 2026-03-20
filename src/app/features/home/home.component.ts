import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { PostData } from '../../core/models/post.interface';
import { AuthService } from '../../core/services/auth/auth.service';
import { PostsService } from '../../core/services/posts/posts.service';
import { SuggestedComponent } from '../../shared/components/suggested/suggested.component';
import { FeedComponent } from '../feed/feed.component';

type TabType = 'feed' | 'myPosts' | 'community' | 'saved';

@Component({
  selector: 'app-home',
  imports: [FeedComponent, SuggestedComponent, CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private readonly postsService = inject(PostsService);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  readonly currentUser = this.authService.currentUser;

  readonly posts = signal<PostData[]>([]);
  readonly activeTab = signal<TabType>('feed');
  readonly isLoading = signal(false);
  readonly hasError = signal(false);
  readonly errorMessage = signal('');

  readonly isEmpty = computed(() => !this.isLoading() && this.posts().length === 0);
  readonly currentUserId = computed(() => this.currentUser()?._id);

  readonly tabLoadingStates = signal<Record<TabType, boolean>>({
    feed: false,
    myPosts: false,
    community: false,
    saved: false,
  });

  ngOnInit(): void {
    this.loadFeed();
  }

  loadFeed(): void {
    if (this.isLoading()) return;

    // Prevent duplicate requests for feed tab
    const currentStates = this.tabLoadingStates();
    if (currentStates.feed) return;

    this.activeTab.set('feed');
    this.hasError.set(false);
    this.isLoading.set(true);
    this.tabLoadingStates.set({ ...currentStates, feed: true });

    this.postsService
      .getFeed()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading.set(false);
          this.tabLoadingStates.update((states) => ({ ...states, feed: false }));
        }),
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

    const userId = this.currentUserId();
    if (!userId) {
      this.hasError.set(true);
      this.errorMessage.set('User data not found. Please refresh the page.');
      return;
    }

    const currentStates = this.tabLoadingStates();
    if (currentStates.myPosts) return;

    this.activeTab.set('myPosts');
    this.hasError.set(false);
    this.isLoading.set(true);
    this.tabLoadingStates.set({ ...currentStates, myPosts: true });

    this.authService
      .getUserPosts(userId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading.set(false);
          this.tabLoadingStates.update((states) => ({ ...states, myPosts: false }));
        }),
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

    const currentStates = this.tabLoadingStates();
    if (currentStates.community) return;

    this.activeTab.set('community');
    this.hasError.set(false);
    this.isLoading.set(true);
    this.tabLoadingStates.set({ ...currentStates, community: true });

    this.postsService
      .getAllPosts()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading.set(false);
          this.tabLoadingStates.update((states) => ({ ...states, community: false }));
        }),
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

    const currentStates = this.tabLoadingStates();
    if (currentStates.saved) return;

    this.activeTab.set('saved');
    this.hasError.set(false);
    this.isLoading.set(true);
    this.tabLoadingStates.set({ ...currentStates, saved: true });

    this.authService
      .getBookmarks()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading.set(false);
          this.tabLoadingStates.update((states) => ({ ...states, saved: false }));
        }),
      )
      .subscribe({
        next: (response: any) => {
          this.posts.set(response.data?.bookmarks || []);
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
