import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { AuthService } from '../services/auth/auth.service';
import { ErrorHandlerService } from '../services/error-handler.service';

export const errorsInterceptor: HttpInterceptorFn = (req, next) => {
  const errorHandler = inject(ErrorHandlerService);
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    tap((response: any) => {
      console.log(`Request ${req.url} came from: Unknown or Service`, response);

      if (errorHandler.shouldShowSuccessNotification(req.url, req.method)) {
        errorHandler.handleSuccess(response);
      }

      if (req.url.includes('signin') || req.url.includes('change-password')) {
        const data = response?.body?.data;

        if (data) {
          if (req.url.includes('signin')) {
            authService.setUserData(data.token, data.user);
          } else {
            authService.setUserData(
              data.token,
              JSON.parse(localStorage.getItem(environment.userData) || ''),
            );
          }

          router.navigate(['/home']);
          return;
        }
      }

      if (req.url.includes('signup')) {
        router.navigate(['/auth/login']);
        return;
      }
    }),

    catchError((err: HttpErrorResponse) => {
      errorHandler.handleError(err);
      return throwError(() => err);
    }),
  );
};
