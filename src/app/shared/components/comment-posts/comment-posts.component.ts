import { Component, computed, DestroyRef, inject, Input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { CommentData } from '../../../core/models/comment.interface';
import { CommentsService } from '../../../core/services/comments/comments.service';
import { ReplyComponent } from '../reply/reply.component';

@Component({
  selector: 'app-comment-posts',
  imports: [ReplyComponent],
  templateUrl: './comment-posts.component.html',
  styleUrl: './comment-posts.component.css',
})
export class CommentPostsComponent {
  private readonly commentsService = inject(CommentsService);
  private readonly destroyRef = inject(DestroyRef);

  @Input({ required: true }) postId!: string;

  readonly comments = signal<CommentData[]>([]);
  readonly isLoading = signal(false);
  readonly showLoadMore = signal(false);
  readonly currentPage = signal(1);
  readonly errorMessage = signal('');
  readonly expandedReplies = signal<Set<string>>(new Set());
  readonly replies = signal<Map<string, CommentData[]>>(new Map());

  readonly isEmpty = computed(() => !this.isLoading() && this.comments().length === 0);

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(page: number = 1): void {
    if (this.isLoading()) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.commentsService
      .getPostComments(this.postId, { page: page, limit: 10 })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (response) => {
          if (response.data?.comments) {
            if (page === 1) {
              this.comments.set(response.data.comments);
            } else {
              this.comments.update((prev) => [...prev, ...response.data.comments]);
            }
            this.showLoadMore.set(response.data.comments.length === 10);
            this.currentPage.set(page);
          }
        },
        error: (error) => {
          this.errorMessage.set('Failed to load comments. Please try again.');
          console.error('Comments load error:', error);
        },
      });
  }

  loadMoreComments(): void {
    this.loadComments(this.currentPage() + 1);
  }

  refreshComments(): void {
    this.loadComments(1);
  }

  likeComment(commentId: string): void {
    this.isLoading.set(true);

    this.commentsService
      .putLikeComment(this.postId, commentId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (response) => {
          if (response.data?.comment) {
            this.comments.update((comments) =>
              comments.map((comment) =>
                comment._id === commentId
                  ? { ...comment, likesCount: response.data.likesCount }
                  : comment,
              ),
            );
          }
        },
        error: (error) => {
          console.error('Like comment error:', error);
        },
      });
  }

  toggleReplies(commentId: string): void {
    const currentExpanded = this.expandedReplies();
    const newExpanded = new Set(currentExpanded);

    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
      this.loadReplies(commentId);
    }

    this.expandedReplies.set(newExpanded);
  }

  loadReplies(commentId: string): void {
    if (this.replies().has(commentId)) return;

    this.isLoading.set(true);

    this.commentsService
      .getCommentReplies(this.postId, commentId, { page: 1, limit: 5 })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (response) => {
          if (response.data?.replies) {
            this.replies.update((prev) => new Map(prev.set(commentId, response.data.replies)));
          }
        },
        error: (error) => {
          console.error('Load replies error:', error);
        },
      });
  }

  onCommentPosted(comment: CommentData): void {
    this.comments.update((prev) => [comment, ...prev]);
  }

  onReplyPosted(commentId: string, reply: CommentData): void {
    this.replies.update((prev) => {
      const currentReplies = prev.get(commentId) || [];
      return new Map(prev.set(commentId, [reply, ...currentReplies]));
    });
  }

  deleteComment(commentId: string): void {
    this.comments.update((comments) => comments.filter((comment) => comment._id !== commentId));

    this.commentsService.deleteComment(this.postId, commentId).subscribe({
      error: () => {
        this.loadComments();
      },
    });
  }

  getTimeAgo(createdAt: string): string {
    if (!createdAt) return 'now';

    const now = new Date();
    const commentDate = new Date(createdAt);

    if (isNaN(commentDate.getTime())) return 'unknown';

    const secondsAgo = Math.floor((now.getTime() - commentDate.getTime()) / 1000);

    if (secondsAgo < 60) return `${secondsAgo}s`;
    if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)}m`;
    if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)}h`;
    if (secondsAgo < 604800) return `${Math.floor(secondsAgo / 86400)}d`;

    return commentDate.toLocaleDateString();
  }
}
