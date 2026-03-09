import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { AuthService } from '../../core/services/auth/auth.service';
import { AlertComponent } from '../../shared/components/alert/alert.component';

@Component({
  selector: 'app-chang-password',
  imports: [ReactiveFormsModule, AlertComponent, NgIf, NgClass, CommonModule],
  templateUrl: './chang-password.component.html',
  styleUrl: './chang-password.component.css',
})
export class ChangPasswordComponent implements OnInit {
  private readonly formBuild = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  changePasswordForm!: FormGroup;
  isSubmitted = false;
  errorMessage = '';

  // Use signals for password visibility
  showCurPassword = signal(false);
  showPassword = signal(false);
  showRePassword = signal(false);

  private readonly validationMessages: Record<string, Record<string, string>> = {
    password: {
      required: 'Please enter your current Password.',
    },
    newPassword: {
      required: 'Password is required.',
      minlength: 'Password must be at least 8 characters long.',
      pattern: 'Password must contain uppercase, lowercase, number, and special character.',
    },
    rePassword: {
      required: 'Please confirm your password.',
      mismatch: 'Passwords do not match.',
    },
  };

  ngOnInit(): void {
    this.changePasswordForm = this.formBuild.group(
      {
        password: ['', [Validators.required]],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(environment.PASSWORD_PATTERN),
          ],
        ],
        rePassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const newPassword = group.get('newPassword')?.value;
    const rePassword = group.get('rePassword')?.value;

    if (!newPassword || !rePassword) return null;

    return newPassword === rePassword ? null : { mismatch: true };
  }

  get formErrors(): string[] {
    const errors: string[] = [];
    if (!this.changePasswordForm) return errors;

    if (this.changePasswordForm.hasError('mismatch')) {
      const confirmCtrl = this.changePasswordForm.get('rePassword');
      if (confirmCtrl?.touched || confirmCtrl?.dirty || this.isSubmitted) {
        errors.push(this.validationMessages['rePassword']['mismatch']);
      }
    }

    Object.entries(this.changePasswordForm.controls).forEach(([key, control]) => {
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

    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      this.isSubmitted = false;
      return;
    }

    const { rePassword, ...data } = this.changePasswordForm.value;
    this.authService
      .patchChangePassword(data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {},
      });
    this.isSubmitted = false;
  }

  toggleCurPasswordVisibility(): void {
    this.showCurPassword.update((v) => !v);
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  toggleRePasswordVisibility(): void {
    this.showRePassword.update((v) => !v);
  }
}
