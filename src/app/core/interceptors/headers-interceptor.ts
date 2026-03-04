import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem(environment.userToken);
  if (token) {
    if (
      req.url.includes('posts') ||
      req.url.includes('comments') ||
      req.url.includes('notifications') ||
      (req.url.includes('users') && !req.url.includes('/signup') && !req.url.includes('/signin'))
    ) {
      req = req.clone({
        setHeaders: {
          authorization: `Bearer ${token}`,
        },
      });
    }
  }
  req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
    },
  });
  return next(req);
};
