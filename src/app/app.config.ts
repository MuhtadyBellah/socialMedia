import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  provideRouter,
  withHashLocation,
  withInMemoryScrolling,
  withViewTransitions,
} from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { headersInterceptor } from './core/interceptors/headers-interceptor';
import { errorsInterceptor } from './core/interceptors/errors-interceptor';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { loadingInterceptor } from './core/interceptors/loading-interceptor';
//search animate.enter | animate.leave

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'top' }),
      withViewTransitions({
        skipInitialTransition: true,
      }),
      withHashLocation(),
    ),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        // authInterceptor,
        headersInterceptor,
        errorsInterceptor,
        loadingInterceptor,
      ]),
    ),
    provideToastr(),
    provideAnimations(),
  ],
};
