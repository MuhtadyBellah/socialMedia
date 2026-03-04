import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { ErrorHandlerService } from '../services/error-handler.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { Default, DefaultResponse } from '../models/default.interface';

export const errorsInterceptor: HttpInterceptorFn = (req, next) => {
  const errorHandler = inject(ErrorHandlerService);
  const router = inject(Router);
  const TOKEN_KEY = environment.userToken;

  return next(req).pipe(
    tap((response: any) => {
      if (errorHandler.shouldShowSuccessNotification(req.url, req.method)) {
        errorHandler.handleSuccess(response);
      }

      if (req.url.includes('signin') || req.url.includes('change-password')) {
        console.log(response);
        const token = response?.body?.data?.token;
        if (token) {
          localStorage.setItem(TOKEN_KEY, token);
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
