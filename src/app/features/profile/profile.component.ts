import { NgClass } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, switchMap } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { UserData } from '../../core/models/auth.interface';
import { BookmarkData } from '../../core/models/bookmark.interface';
import { PostData } from '../../core/models/post.interface';
import { AuthService } from '../../core/services/auth/auth.service';
import { ProfilePhotoComponent } from '../../shared/components/profile-photo/profile-photo.component';
import { ProfilePostsComponent } from '../../shared/components/profile-posts/profile-posts.component';

type ActiveTab = 'posts' | 'bookmarks';

@Component({
  selector: 'app-profile',
  imports: [ProfilePhotoComponent, NgClass, ProfilePostsComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);

  readonly userId = signal('');
  readonly activeTab = signal<ActiveTab>('posts');
  readonly currentUser = signal<UserData | null>(null);
  readonly posts = signal<PostData[]>([]);
  readonly bookmarks = signal<BookmarkData[]>([]);
  readonly errorMessage = signal('');
  readonly isLoading = signal(true);
  readonly isViewed = signal(false);

  readonly hasPosts = computed(() => this.posts().length >= 0);
  readonly hasBookmarks = computed(() => this.bookmarks().length >= 0);
  readonly isEmpty = computed(
    () => !this.isLoading() && !this.hasPosts() && this.activeTab() === 'posts',
  );
  readonly isBookmarksEmpty = computed(
    () => !this.isLoading() && !this.hasBookmarks() && this.activeTab() === 'bookmarks',
  );

  ngOnInit(): void {
    this.userId.set('');
    this.userId.set(this.route.snapshot.paramMap.get('id') || '');
    this.loadProfileData();
  }

  private loadProfileData(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    if (this.userId()) {
      forkJoin({
        userData: this.authService.getUserProfile(this.userId()),
        postsData: this.authService.getUserPosts(this.userId()),
      })
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          finalize(() => {
            this.isLoading.set(false);
          }),
        )
        .subscribe({
          next: (result: any) => {
            this.currentUser.set(result.userData.data?.user);
            this.posts.set(result.postsData.data?.posts || []);
            this.bookmarks.set([]);
            this.errorMessage.set('');
          },
          error: (error) => {
            console.error('Error fetching profile data:', error);
            this.errorMessage.set('Failed to load profile data. Please try again.');
          },
        });
      return;
    }

    this.authService
      .getProfileData()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((profileResponse: any) => {
          this.currentUser.set(profileResponse.data.user);

          const userId = profileResponse.data.user.id || profileResponse.data.user._id;

          if (!userId) {
            this.errorMessage.set('Unable to load profile data');
            this.isLoading.set(false);
            throw new Error('User ID not found');
          }

          return forkJoin({
            postsData: this.authService.getUserPosts(userId),
            bookmarksData: this.authService.getBookmarks(),
          });
        }),
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe({
        next: (result: any) => {
          this.posts.set(result.postsData.data?.posts || []);
          this.bookmarks.set(result.bookmarksData.data?.bookmarks || []);
          this.errorMessage.set('');
        },
        error: (error) => {
          console.error('Error fetching profile data:', error);
          this.errorMessage.set('Failed to load profile data. Please try again.');
        },
      });
  }

  switchTab(tab: ActiveTab): void {
    this.activeTab.set(tab);
  }

  retryLoad(): void {
    this.loadProfileData();
  }
}
