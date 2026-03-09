import { CommonModule } from '@angular/common';
import { Component, Input, computed, inject, signal } from '@angular/core';
import { PostData } from '../../../core/models/post.interface';
import { PostsService } from '../../../core/services/posts/posts.service';

@Component({
  selector: 'app-single-post',
  imports: [CommonModule],
  templateUrl: './single-post.component.html',
  styleUrl: './single-post.component.css',
})
export class SinglePostComponent {
  private readonly postsService = inject(PostsService);

  @Input() post!: PostData;

  readonly isLiking = signal(false);
  readonly isBookmarking = signal(false);
  readonly isSharing = signal(false);
  readonly isMenuOpen = signal(false);

  readonly isBookmarked = computed(() => this.post.bookmarked || false);
  readonly likeCount = computed(() => this.post.likesCount || 0);
  readonly commentCount = computed(() => this.post.commentsCount || 0);
  readonly shareCount = computed(() => this.post.sharesCount || 0);

  toggleMenu(): void {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  toggleLike(): void {
    if (!this.post?._id || this.isLiking()) return;

    this.isLiking.set(true);

    this.postsService.putLikePost(this.post._id, {}).subscribe({
      next: () => {
        this.isLiking.set(false);
      },
      error: () => {
        this.isLiking.set(false);
      },
    });
  }

  toggleBookmark(): void {
    if (!this.post?._id || this.isBookmarking()) return;

    this.isBookmarking.set(true);

    this.postsService.putBookmarkPost(this.post._id, {}).subscribe({
      next: () => {
        this.isBookmarking.set(false);
      },
      error: () => {
        this.isBookmarking.set(false);
      },
    });
  }

  sharePost(): void {
    if (!this.post?._id || this.isSharing()) return;

    this.isSharing.set(true);

    this.postsService.postShare(this.post._id, { body: 'Sharing this great post' }).subscribe({
      next: () => {
        this.isSharing.set(false);
      },
      error: () => {
        this.isSharing.set(false);
      },
    });
  }

  getTimeAgo(createdAt: string): string {
    const now = new Date();
    const postDate = new Date(createdAt);
    const secondsAgo = Math.floor((now.getTime() - postDate.getTime()) / 1000);

    if (secondsAgo < 60) return `${secondsAgo}s`;
    if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)}m`;
    if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)}h`;
    if (secondsAgo < 604800) return `${Math.floor(secondsAgo / 86400)}d`;

    return postDate.toLocaleDateString();
  }
}
