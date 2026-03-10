import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [AlertComponent, ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private readonly formBuild = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  loginForm!: FormGroup;

  readonly isLoading = signal(false);
  readonly showPassword = signal(false);
  readonly errorMessage = signal('');

  readonly isSubmitDisabled = computed(() => this.isLoading());

  ngOnInit(): void {
    this.loginForm = this.formBuild.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set('');
    this.isLoading.set(true);

    const { email, password } = this.loginForm.value;

    this.authService
      .postLogin({ email, password })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isLoading.set(false);
        },
        error: (error) => {
          this.isLoading.set(false);
          if (error.status === 400) {
            this.errorMessage.set('Incorrect email or password');
          } else if (error.status === 401) {
            this.errorMessage.set('Invalid credentials');
          } else if (error.status === 0) {
            this.errorMessage.set('Unable to connect to server. Please check your connection.');
          } else {
            this.errorMessage.set('Login failed. Please try again.');
          }
        },
      });
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((val) => !val);
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (!field || !field.errors || !field.touched) {
      return '';
    }

    if (field.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (field.hasError('email')) {
      return 'Please enter a valid email address';
    }
    return '';
  }
}
