import {
  Component,
  computed,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentData } from '../../../core/models/comment.interface';
import { CommentsService } from '../../../core/services/comments/comments.service';

@Component({
  selector: 'app-reply',
  imports: [ReactiveFormsModule],
  templateUrl: './reply.component.html',
  styleUrl: './reply.component.css',
})
export class ReplyComponent {
  private readonly commentsService = inject(CommentsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);

  @Input({ required: true }) postId!: string;
  @Input({ required: true }) mode: 'reply' | 'comment' = 'comment';
  @Input() commentId?: string;
  @Output() commentPosted = new EventEmitter<CommentData>();
  @Output() replyPosted = new EventEmitter<CommentData>();

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');
  readonly selectedImage = signal<File | null>(null);
  readonly imagePreview = signal<string | null>(null);

  commentForm!: FormGroup;

  readonly isSubmitDisabled = computed(() => this.commentForm.invalid || this.isSubmitting());

  ngOnInit(): void {
    this.initCommentForm();
  }

  private initCommentForm(): void {
    this.commentForm = this.formBuilder.group({
      content: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(500)]],
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedImage.set(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedImage.set(null);
    this.imagePreview.set(null);

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  onSubmit(): void {
    if (this.commentForm.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    const content = this.commentForm.get('content')?.value;

    const formData: any = { content };
    if (this.selectedImage()) {
      formData.image = this.selectedImage();
    }

    const serviceCall =
      this.mode === 'reply' && this.commentId
        ? this.commentsService.postReply(this.postId, this.commentId, formData)
        : this.commentsService.postComment(this.postId, formData);

    serviceCall
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          if (response.data?.comment || response.data?.reply) {
            const newComment = response.data.comment || response.data.reply;
            if (this.mode === 'reply') {
              this.replyPosted.emit(newComment);
            } else {
              this.commentPosted.emit(newComment);
            }
          }
          this.commentForm.reset();
          this.removeImage();
          this.errorMessage.set('');
        },
        error: (error) => {
          this.errorMessage.set(`Failed to post ${this.mode}. Please try again.`);
          console.error(`${this.mode} error:`, error);
        },
      })
      .add(() => {
        this.isSubmitting.set(false);
      });
  }
}
