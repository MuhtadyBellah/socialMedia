import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { authGuard } from '../guards/auth-guard';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem(environment.userToken);
  if (token) {
    if (
      req.url.includes('posts') ||
      req.url.includes('comments') ||
      req.url.includes('notifications')
    ) {
      req = req.clone({
        setHeaders: {
          authorization: `Bearer ${token}`,
        },
      });
    }
  }
  return next(req);
};
