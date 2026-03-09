import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from '../../../environments/environment.development';
import { UserData } from '../../core/models/auth.interface';
import { AuthService } from '../../core/services/auth/auth.service';
import { PostsService } from '../../core/services/posts/posts.service';
import { SuggestedComponent } from '../../shared/components/suggested/suggested.component';
import { FeedComponent } from '../feed/feed.component';

@Component({
  selector: 'app-home',
  imports: [FeedComponent, SuggestedComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private readonly postsService = inject(PostsService);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  readonly posts = signal<any>([]);
  activeTab = signal<'feed' | 'myPosts' | 'community' | 'saved'>('feed');

  ngOnInit(): void {
    this.loadFeed();
  }

  loadFeed(): void {
    this.activeTab.set('feed');
    this.postsService
      .getFeed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          this.posts.set(response.data?.posts || []);
        },
      });
  }

  loadMyPosts(): void {
    this.activeTab.set('myPosts');
    const storedData: UserData = JSON.parse(localStorage.getItem(environment.userData) || '');

    this.authService
      .getUserPosts(storedData._id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.posts.set(response.data?.posts || []);
        },
      });
  }

  loadALLPosts(): void {
    this.activeTab.set('community');
    this.postsService
      .getAllPosts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          this.posts.set(response.data?.posts || []);
        },
      });
  }

  loadSavedPosts(): void {
    this.activeTab.set('saved');
    this.authService
      .getBookmarks()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          this.posts.set(response.data?.posts || []);
        },
      });
  }
}
