import { Component, DestroyRef, inject, OnInit, signal, computed } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, AlertComponent, RouterLink, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  private readonly formBuild = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  registerForm!: FormGroup;

  readonly isLoading = signal(false);
  readonly showPassword = signal(false);
  readonly showRePassword = signal(false);

  readonly isSubmitDisabled = computed(() => this.registerForm?.invalid || this.isLoading());

  private readonly validationMessages: Record<string, Record<string, string>> = {
    name: { required: 'Full name is required.' },
    email: {
      required: 'Email address is required.',
      email: 'Please enter a valid email address.',
    },
    password: {
      required: 'Password is required.',
      minlength: 'Password must be at least 8 characters long.',
      pattern: 'Password must contain uppercase, lowercase, number, and special character.',
    },
    rePassword: {
      required: 'Please confirm your password.',
      mismatch: 'Passwords do not match.',
    },
    phone: {
      pattern: 'Please enter a valid Egyptian phone number (e.g., 010...).',
    },
    terms: { required: 'You must agree to the Terms and Conditions.' },
  };

  ngOnInit(): void {
    this.registerForm = this.formBuild.group(
      {
        name: ['', Validators.required],
        username: [''],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(environment.PASSWORD_PATTERN),
          ],
        ],
        rePassword: ['', Validators.required],
        gender: [''],
        dateOfBirth: [''],
        phone: ['', [Validators.pattern(environment.PHONE_EG)]],
        country: [''],
        terms: [false, Validators.requiredTrue],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  /**
   * Custom validator to ensure password and rePassword match
   */
  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const rePassword = group.get('rePassword')?.value;

    if (!password || !rePassword) return null;

    return password === rePassword ? null : { mismatch: true };
  }

  getFormErrors(): string[] {
    const errors: string[] = [];
    if (!this.registerForm) return errors;

    if (this.registerForm.hasError('mismatch')) {
      const confirmCtrl = this.registerForm.get('rePassword');
      if (confirmCtrl?.touched || confirmCtrl?.dirty || this.isLoading()) {
        errors.push(this.validationMessages['rePassword']['mismatch']);
      }
    }

    Object.entries(this.registerForm.controls).forEach(([key, control]) => {
      if (control.invalid && (control.dirty || control.touched || this.isLoading())) {
        Object.keys(control.errors || {}).forEach((errorKey) => {
          const message = this.validationMessages[key]?.[errorKey];
          if (message && !errors.includes(message)) {
            errors.push(message);
          }
        });
      }
    });

    return errors;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const email = this.registerForm.get('email')?.value;
    this.registerForm.get('username')?.setValue(email.split('@')[0] || '');

    const { phone, country, terms, ...registerData } = this.registerForm.value;

    this.authService
      .postRegister(registerData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {},
        error: () => {
          this.isLoading.set(false);
        },
      });
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((val) => !val);
  }

  toggleRePasswordVisibility(): void {
    this.showRePassword.update((val) => !val);
  }

  /**
   * Helper to get specific field error message
   */
  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (!field || !field.errors || !field.touched) {
      return '';
    }

    const errorKey = Object.keys(field.errors)[0];
    return this.validationMessages[fieldName]?.[errorKey] || '';
  }

  /**
   * Check if a specific field has an error
   */
  hasFieldError(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }
}
