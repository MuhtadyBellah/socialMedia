import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { CommonModule } from '@angular/common';

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
  private readonly router = inject(Router);

  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  // controls whether password inputs are visible
  showPassword = false;
  showRePassword = false;

  ngOnInit(): void {
    this.loginForm = this.formBuild.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false],
    });
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.isLoading = true;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.isLoading = false;
      return;
    }

    const { email, password } = this.loginForm.value;
    this.authService
      .postLogin({ email, password })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Login successful', response);
          if (response.token) {
            localStorage.setItem('authToken', response.token);
          }
          this.router.navigate(['/main/home']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Invalid email or password. Please try again.';
        },
      });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
