import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PostData } from '../../../core/models/post.interface';
import { PostsService } from '../../../core/services/posts/posts.service';
import { CommentPostsComponent } from '../comment-posts/comment-posts.component';
import { ProfilePhotoComponent } from '../profile-photo/profile-photo.component';

@Component({
  selector: 'app-single-post',
  imports: [CommonModule, CommentPostsComponent, RouterLink, ProfilePhotoComponent],
  templateUrl: './single-post.component.html',
  styleUrl: './single-post.component.css',
})
export class SinglePostComponent implements OnInit, OnChanges {
  private readonly postsService = inject(PostsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly _localPost = signal<PostData | null>(null);
  private route = inject(ActivatedRoute);

  @Input() post!: PostData;

  readonly isLiking = signal(false);
  readonly isBookmarking = signal(false);
  readonly isSharing = signal(false);
  readonly isDeleting = signal(false);
  readonly isMenuOpen = signal(false);
  readonly showComments = signal(false);
  readonly isViewed = signal(false);

  readonly isLocal = computed(() => this._localPost() === this.post);
  readonly localPost = computed(() => this._localPost() || this.post);
  readonly isBookmarked = computed(() => this.localPost().bookmarked || false);
  readonly likeCount = computed(() => this.localPost().likesCount || 0);
  readonly commentCount = computed(() => this.localPost().commentsCount || 0);
  readonly shareCount = computed(() => this.localPost().sharesCount || 0);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id && !this.post) {
      this.postsService.getSinglePost(id).subscribe((res) => {
        this._localPost.set(res.data.post);
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['post']) {
      this._localPost.set(changes['post'].currentValue);
    }
  }

  toggleMenu(): void {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  toggleComments(): void {
    this.showComments.set(!this.showComments());
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  toggleLike(): void {
    if (!this.post?._id || this.isLiking()) return;

    const newLikeCount = this.localPost().isLiked
      ? this.localPost().likesCount - 1
      : this.localPost().likesCount + 1;

    this.isLiking.set(true);
    this._localPost.set({
      ...this.localPost(),
      likesCount: newLikeCount,
      isLiked: !this.localPost().isLiked,
    });

    this.postsService
      .putLikePost(this.post._id, {})
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          if (response.data?.post) {
            this._localPost.set(response.data.post);
          }
          this.isLiking.set(false);
        },
        error: () => {
          this._localPost.set(this.post);
          this.isLiking.set(false);
        },
      });
  }

  toggleBookmark(): void {
    if (!this.post?._id || this.isBookmarking()) return;

    const newBookmarkedState = !this.localPost().bookmarked;

    this.isBookmarking.set(true);
    this._localPost.set({
      ...this.localPost(),
      bookmarked: newBookmarkedState,
    });

    this.postsService
      .putBookmarkPost(this.post._id, {})
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          if (response.data?.post) {
            this._localPost.set(response.data.post);
          }
          this.isBookmarking.set(false);
        },
        error: () => {
          this._localPost.set(this.post);
          this.isBookmarking.set(false);
        },
      });
  }

  sharePost(): void {
    if (!this.post?._id || this.isSharing()) return;

    this.isSharing.set(true);
    const currentShareCount = this.localPost().sharesCount || 0;
    this._localPost.set({
      ...this.localPost(),
      sharesCount: currentShareCount + 1,
    });

    this.postsService
      .postShare(this.post._id, { body: 'Sharing this great post @mentor_User' })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          if (response.data?.post) {
            this._localPost.set(response.data.post);
          }
          this.isSharing.set(false);
        },
        error: () => {
          this._localPost.set(this.post);
          this.isSharing.set(false);
        },
      });
  }

  deletePost(): void {
    if (!this.post?._id || this.isDeleting()) return;

    this.isDeleting.set(true);

    this.postsService
      .deletePost({ postId: this.post._id })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isDeleting.set(false);
          this.closeMenu();
        },
        error: () => {
          this._localPost.set(this.post);
          this.isDeleting.set(false);
          this.closeMenu();
        },
      });
  }

  getTimeAgo(createdAt: string): string {
    if (!createdAt) return 'now';

    const now = new Date();
    const postDate = new Date(createdAt);

    if (isNaN(postDate.getTime())) return 'unknown';

    const secondsAgo = Math.floor((now.getTime() - postDate.getTime()) / 1000);

    if (secondsAgo < 60) return `${secondsAgo}s`;
    if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)}m`;
    if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)}h`;
    if (secondsAgo < 604800) return `${Math.floor(secondsAgo / 86400)}d`;

    return postDate.toLocaleDateString();
  }
}
