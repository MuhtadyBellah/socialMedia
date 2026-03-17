import {
  Component,
  computed,
  DestroyRef,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommentData } from '../../../core/models/comment.interface';
import { CommentsService } from '../../../core/services/comments/comments.service';
import { EmojyComponent } from '../emojy/emojy.component';

@Component({
  selector: 'app-reply',
  imports: [ReactiveFormsModule, FormsModule, EmojyComponent],
  templateUrl: './reply.component.html',
  styleUrl: './reply.component.css',
})
export class ReplyComponent {
  private readonly commentsService = inject(CommentsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);
  private readonly elementRef = inject(ElementRef);

  @Input({ required: true }) postId!: string;
  @Input({ required: true }) mode: 'reply' | 'comment' = 'comment';
  @Input() commentId?: string;
  @Output() commentPosted = new EventEmitter<CommentData>();
  @Output() replyPosted = new EventEmitter<CommentData>();

  postText = signal('');
  imagePreview = signal('');
  selectedImage = signal<File | null>(null);

  readonly errorMessage = signal('');
  readonly isSubmitting = signal(false);
  readonly showPicker = signal(false);

  commentForm!: FormGroup;

  readonly isSubmitDisabled = computed(() => {
    const text = this.postText().trim();
    const post = this.selectedImage();
    return !(text || post !== null) || this.isSubmitting();
  });

  ngOnInit(): void {
    this.initCommentForm();
  }

  private initCommentForm(): void {
    this.commentForm = this.formBuilder.group({
      content: ['', [Validators.minLength(1), Validators.maxLength(500)]],
      image: [null],
    });
  }

  togglePicker(): void {
    this.showPicker.update((v) => !v);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showPicker.set(false);
    }
  }

  onEmojiSelected(emoji: any): void {
    const currentContent = this.commentForm.get('content')?.value || '';
    this.commentForm.get('content')?.setValue(currentContent + emoji);
    this.showPicker.set(false);
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
    this.imagePreview.set('');

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

    serviceCall.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
        this.postText.set('');
        this.removeImage();
        this.isSubmitting.set(false);
        this.errorMessage.set('');
      },
      error: (error) => {
        this.errorMessage.set(`Failed to post ${this.mode}. Please try again.`);
        this.isSubmitting.set(false);
      },
    });
  }
}
