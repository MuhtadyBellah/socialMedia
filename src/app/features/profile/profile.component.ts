import { NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin, switchMap } from 'rxjs';
import { UserData } from '../../core/models/auth.interface';
import { AuthService } from '../../core/services/auth/auth.service';
import { ProfilePhotoComponent } from '../../shared/components/profile-photo/profile-photo.component';
import { ProfilePostsComponent } from '../../shared/components/profile-posts/profile-posts.component';

@Component({
  selector: 'app-profile',
  imports: [ProfilePhotoComponent, NgClass, ProfilePostsComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);

  currentUser: UserData | null = null;
  posts: any = null;
  bookmarks: any = null;
  isViewed = false;

  ngOnInit(): void {
    this.authService
      .getProfileData()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((profileResponse: any) => {
          setTimeout(() => {
            this.currentUser = profileResponse.data.user;
          }, 3000);
          const userId = profileResponse.data.user.id || profileResponse.data.user._id;

          return forkJoin({
            postsData: this.authService.getUserPosts(userId),
            bookmarksData: this.authService.getBookmarks(),
          });
        }),
      )
      .subscribe({
        next: (result: any) => {
          this.posts = result.postsData.data.posts;
          this.bookmarks = result.bookmarksData.data.bookmarks;

          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error fetching profile data:', error);
        },
      });
  }
}
