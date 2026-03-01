import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { AuthService } from '../../services/auth.service';
import { ErrorResponse } from '../../../models/error.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

const PATTERNS = {
  PASSWORD: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/,
  PHONE_EG: /^01[0125]\d{8}$/,
};

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
  private readonly router = inject(Router);

  registerForm!: FormGroup;
  isSubmitted = false;
  errorMessage = '';

  // controls whether password inputs are visible
  showPassword = false;
  showRePassword = false;

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
          [Validators.required, Validators.minLength(8), Validators.pattern(PATTERNS.PASSWORD)],
        ],
        rePassword: ['', Validators.required],
        gender: [''],
        dateOfBirth: [''],
        phone: ['', [Validators.pattern(PATTERNS.PHONE_EG)]],
        country: [''],
        terms: [false, Validators.requiredTrue],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const rePassword = group.get('rePassword')?.value;

    if (!password || !rePassword) return null;

    return password === rePassword ? null : { mismatch: true };
  }

  get formErrors(): string[] {
    const errors: string[] = [];
    if (!this.registerForm) return errors;

    if (this.registerForm.hasError('mismatch')) {
      const confirmCtrl = this.registerForm.get('rePassword');
      if (confirmCtrl?.touched || confirmCtrl?.dirty || this.isSubmitted) {
        errors.push(this.validationMessages['rePassword']['mismatch']);
      }
    }

    Object.entries(this.registerForm.controls).forEach(([key, control]) => {
      if (control.invalid && (control.dirty || control.touched || this.isSubmitted)) {
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
    this.errorMessage = '';
    this.isSubmitted = true;

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.isSubmitted = false;
      return;
    }

    const email = this.registerForm.get('email')?.value;
    this.registerForm.get('username')?.setValue(email.split('@')[0] || '');

    const { phone, country, terms, ...registerData } = this.registerForm.value;
    this.authService
      .postRegister(registerData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.registerForm.reset();
          this.errorMessage = '';
          this.isSubmitted = false;
          this.router.navigate(['/auth/login']);
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage =
            error.error?.message || 'An error occurred during registration. Please try again.';
          this.isSubmitted = false;
        },
      });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleRePasswordVisibility(): void {
    this.showRePassword = !this.showRePassword;
  }
}
