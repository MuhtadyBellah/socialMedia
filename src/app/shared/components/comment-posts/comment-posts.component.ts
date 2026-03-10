import { Component, computed, DestroyRef, inject, Input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentData } from '../../../core/models/comment.interface';
import { CommentsService } from '../../../core/services/comments/comments.service';

@Component({
  selector: 'app-comment-posts',
  imports: [ReactiveFormsModule],
  templateUrl: './comment-posts.component.html',
  styleUrl: './comment-posts.component.css',
})
export class CommentPostsComponent {
  private readonly commentsService = inject(CommentsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);

  @Input({ required: true }) postId!: string;

  readonly comments = signal<CommentData[]>([]);
  readonly isLoading = signal(false);
  readonly isSubmitting = signal(false);
  readonly showLoadMore = signal(false);
  readonly currentPage = signal(1);
  readonly errorMessage = signal('');

  commentForm!: FormGroup;

  readonly isEmpty = computed(() => !this.isLoading() && this.comments().length === 0);
  readonly isSubmitDisabled = computed(() => this.commentForm.invalid || this.isSubmitting());

  ngOnInit(): void {
    this.initCommentForm();
    this.loadComments();
  }

  private initCommentForm(): void {
    this.commentForm = this.formBuilder.group({
      content: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(500)]],
    });
  }

  loadComments(page: number = 1): void {
    if (this.isLoading()) return;

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.currentPage.set(page);

    this.commentsService
      .getPostComments(this.postId, { page, limit: 10 })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          const newComments = response.data?.comments || [];

          if (page === 1) {
            this.comments.set(newComments);
          } else {
            this.comments.set([...this.comments(), ...newComments]);
          }

          this.showLoadMore.set(newComments.length === 10);
          this.errorMessage.set('');
        },
        error: (error) => {
          this.errorMessage.set('Failed to load comments. Please try again.');
          this.showLoadMore.set(false);
        },
      })
      .add(() => {
        this.isLoading.set(false);
      });
  }

  loadMoreComments(): void {
    this.loadComments(this.currentPage() + 1);
  }

  retryLoad(): void {
    this.loadComments(1);
  }

  onSubmit(): void {
    if (this.commentForm.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    const content = this.commentForm.get('content')?.value;

    this.commentsService
      .postComment(this.postId, { content })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          if (response.data?.comment) {
            this.comments.set([response.data.comment, ...this.comments()]);
          }
          this.commentForm.reset();
          this.errorMessage.set('');
        },
        error: (error) => {
          this.errorMessage.set('Failed to post comment. Please try again.');
        },
      })
      .add(() => {
        this.isSubmitting.set(false);
      });
  }

  likeComment(commentId: string): void {
    this.comments.update((comments) =>
      comments.map((comment) =>
        comment.id === commentId ? { ...comment, likesCount: comment.likesCount + 1 } : comment,
      ),
    );

    this.commentsService.putLikeComment(this.postId, commentId, {}).subscribe({
      error: () => {
        this.comments.update((comments) =>
          comments.map((comment) =>
            comment.id === commentId ? { ...comment, likesCount: comment.likesCount - 1 } : comment,
          ),
        );
      },
    });
  }

  deleteComment(commentId: string): void {
    this.comments.update((comments) => comments.filter((comment) => comment.id !== commentId));

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
