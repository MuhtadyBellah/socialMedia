import { CommonModule } from '@angular/common';
import {
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
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (!file.type.startsWith('image/')) {
        console.warn('Selected file is not an image');
        return;
      }

      this.postImage.set(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreviewUrl.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.imagePreviewUrl.set('');
    this.postImage.set(null);
  }

  onSubmit(): void {
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
          this.isLoading.set(false);
          this.errorMessage.set('');
        },
        error: (err) => {
          this.isLoading.set(false);
        },
      });
  }
}
