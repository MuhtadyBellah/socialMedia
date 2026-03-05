import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { UserData } from '../../core/auth/models/auth.interface';
import { ProfilePhotoComponent } from '../../shared/components/profile-photo/profile-photo.component';
import { AuthService } from '../../core/auth/services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-profile',
  imports: [ProfilePhotoComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);

  currentUser: UserData | null = null;
  posts: any = 0;
  bookmarks: any = 0;
  isViewed = false;

  ngOnInit(): void {
    this.authService
      .getProfileData()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((response: any) => {
          setTimeout(() => {
            this.currentUser = response.data.user;
          }, 3000);

          const userId = response.data.user.id || response.data.user._id;
          return this.authService.getUserPosts(userId);
        }),
        switchMap((postsResponse: any) => {
          setTimeout(() => {
            this.posts = postsResponse.data.posts;
          }, 3000);

          return this.authService.getBookmarks();
        }),
      )
      .subscribe({
        next: (response: any) => {
          this.bookmarks = response.data.bookmarks;
        },
      });
  }
}
