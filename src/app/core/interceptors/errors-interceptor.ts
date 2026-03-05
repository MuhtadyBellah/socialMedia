import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { ErrorHandlerService } from '../services/error-handler.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';

export const errorsInterceptor: HttpInterceptorFn = (req, next) => {
  const errorHandler = inject(ErrorHandlerService);
  const router = inject(Router);

  return next(req).pipe(
    tap((response: any) => {
      if (errorHandler.shouldShowSuccessNotification(req.url, req.method)) {
        errorHandler.handleSuccess(response);
      }

      if (req.url.includes('signin') || req.url.includes('change-password')) {
        const data = response?.body?.data;

        if (data) {
          localStorage.setItem(environment.userToken, data.token);

          if (req.url.includes('signin')) {
            const userData = data.user;
            localStorage.setItem(environment.userData, JSON.stringify(userData));
          }

          router.navigate(['/home']);
        }
      }

      if (req.url.includes('signup')) {
        router.navigate(['/auth/login']);
      }
    }),

    catchError((err: HttpErrorResponse) => {
      errorHandler.handleError(err);
      return throwError(() => err);
    }),
  );
};
