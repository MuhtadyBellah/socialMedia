import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth/auth.service';
import { PostsService } from '../../../core/services/posts/posts.service';
import { EmojyComponent } from '../emojy/emojy.component';

@Component({
  selector: 'app-create-post',
  imports: [CommonModule, FormsModule, EmojyComponent],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatePostComponent {
  private readonly postsService = inject(PostsService);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject(ElementRef);

  postText = signal('');
  imagePreviewUrl = signal('');
  postImage = signal<File | null>(null);

  readonly currentUser = this.authService.currentUser;

  readonly errorMessage = signal('');
  readonly isLoading = signal(false);
  readonly showPicker = signal(false);

  readonly isSubmitDisabled = computed(() => {
    const text = this.postText().trim();
    const post = this.postImage();
    return !(text || post !== null) || this.isLoading();
  });

  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024;
  private readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

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
    this.postText.update((text) => text + emoji);
    this.showPicker.set(false);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    if (!this.ALLOWED_TYPES.includes(file.type)) {
      this.errorMessage.set('Invalid file type. Please select a JPEG, PNG, GIF, or WebP image.');
      setTimeout(() => this.errorMessage.set(''), 3000);
      input.value = '';
      return;
    }

    if (file.size > this.MAX_FILE_SIZE) {
      this.errorMessage.set('File too large. Please select an image smaller than 5MB.');
      setTimeout(() => this.errorMessage.set(''), 3000);
      input.value = '';
      return;
    }

    this.postImage.set(file);
    this.errorMessage.set('');

    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreviewUrl.set(e.target?.result as string);
    };
    reader.onerror = () => {
      this.errorMessage.set('Failed to load image preview.');
      setTimeout(() => this.errorMessage.set(''), 3000);
      this.removeImage();
    };
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.imagePreviewUrl.set('');
    this.postImage.set(null);
  }

  onSubmit(): void {
    if (this.isSubmitDisabled()) return;

    this.errorMessage.set('');
    this.isLoading.set(true);

    const formData = new FormData();
    const text = this.postText().trim();
    if (text) {
      formData.append('body', text);
    }

    const file = this.postImage();
    if (file) {
      formData.append('image', file);
    }

    this.postsService
      .postCreate(formData)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: () => {
          this.postText.set('');
          this.removeImage();
          this.errorMessage.set('');
        },
        error: (err) => {
          this.errorMessage.set('Failed to create post. Please try again.');
          setTimeout(() => this.errorMessage.set(''), 3000);
        },
      });
  }

  onTextInput(event: Event): void {
    const text = (event.target as HTMLTextAreaElement).value;
    this.postText.set(text);
  }
}
