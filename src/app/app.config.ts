import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  provideRouter,
  withHashLocation,
  withInMemoryScrolling,
  withViewTransitions,
} from '@angular/router';

import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { errorsInterceptor } from './core/interceptors/errors-interceptor';
import { headersInterceptor } from './core/interceptors/headers-interceptor';
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
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: '/i18n/',
        suffix: '.json',
      }),
      fallbackLang: 'ar',
      lang: 'en',
    }),
    provideToastr(),
    provideAnimations(),
  ],
};
