import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem(environment.userToken);
  if (token) {
    if (!req.url.includes('/auth/signup') && !req.url.includes('/auth/signin')) {
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
