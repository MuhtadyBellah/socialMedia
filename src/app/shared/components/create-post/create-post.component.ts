import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from '../../../../environments/environment.development';
import { UserData } from '../../../core/models/auth.interface';
import { PostsService } from '../../../core/services/posts/posts.service';

@Component({
  selector: 'app-create-post',
  imports: [CommonModule],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css',
})
export class CreatePostComponent implements OnInit {
  private readonly postsService = inject(PostsService);
  private readonly destroyRef = inject(DestroyRef);

  fileInputRef = viewChild<ElementRef<HTMLInputElement>>('fileInput');
  textAreaRef = viewChild<ElementRef<HTMLTextAreaElement>>('textArea');

  readonly currentUser = signal<UserData | null>(null);

  readonly imagePreviewUrl = signal<string | null>(null);
  readonly isLoading = signal(false);
  readonly postText = signal('');

  readonly isSubmitDisabled = computed(() => {
    const text = this.postText().trim();
    return !text || this.isLoading();
  });

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    const storedData = localStorage.getItem(environment.userData);
    if (storedData) {
      try {
        const userData = JSON.parse(storedData) as UserData;
        this.currentUser.set(userData);
      } catch (error) {
        console.error('Error parsing user data', error);
        this.currentUser.set(null);
      }
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (!file.type.startsWith('image/')) {
        console.warn('Selected file is not an image');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        this.imagePreviewUrl.set(result);
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.imagePreviewUrl.set(null);
    const inputElement = this.fileInputRef();
    if (inputElement) {
      inputElement.nativeElement.value = '';
    }
  }

  onTextInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.postText.set(textarea.value);
  }

  onSubmit(): void {
    const postTextValue = this.textAreaRef()?.nativeElement.value || '';

    if (!postTextValue.trim()) {
      return;
    }

    this.isLoading.set(true);

    const fileInputElement = this.fileInputRef()?.nativeElement;
    const actualFile = fileInputElement?.files?.[0];

    const formData = new FormData();
    formData.append('body', postTextValue);
    if (actualFile) {
      formData.append('image', actualFile);
    }

    this.postsService
      .postCreate(formData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.textAreaRef()!.nativeElement.value = '';
          this.postText.set('');
          this.removeImage();
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
  }
}
