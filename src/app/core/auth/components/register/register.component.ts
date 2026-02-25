import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { initFlowbite } from 'flowbite';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, AlertComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit, AfterViewInit {
  constructor(private formBuild: FormBuilder) {}
  isSubmitted = false;
  registerForm!: FormGroup;

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
    confirmPassword: {
      required: 'Please confirm your password.',
      mismatch: 'Passwords do not match.',
    },
    phone: {
      pattern: 'Please enter a valid Egyptian phone number (e.g., 010...).',
    },
    terms: { required: 'You must agree to the Terms and Conditions.' },
  };

  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (!password || !confirmPassword) return null;

    return password === confirmPassword ? null : { mismatch: true };
  }

  get formErrors(): string[] {
    const errors: string[] = [];

    if (this.registerForm.hasError('mismatch')) {
      const confirmCtrl = this.registerForm.get('confirmPassword');
      if (confirmCtrl?.touched || confirmCtrl?.dirty || this.isSubmitted) {
        errors.push(this.validationMessages['confirmPassword']['mismatch']);
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
    this.isSubmitted = true;

    if (this.registerForm.valid) {
      console.log('Form Submitted successfully', this.registerForm.value);
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  ngOnInit(): void {
    this.registerForm = this.formBuild.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/),
          ],
        ],
        confirmPassword: ['', Validators.required],
        phone: ['', [Validators.pattern(/^01[0125]\d{8}$/)]],
        gender: [''],
        dob: [''],
        country: [''],
        terms: [false, Validators.requiredTrue],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  ngAfterViewInit(): void {
    initFlowbite();
  }
}
