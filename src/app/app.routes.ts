import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/components/login/login.component';
import { RegisterComponent } from './core/auth/components/register/register.component';
import { authGuard } from './core/guards/auth-guard';
import { ChangPasswordComponent } from './features/chang-password/chang-password.component';
import { HomeComponent } from './features/home/home.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { NotificationsComponent } from './features/notifications/notifications.component';
import { ProfileComponent } from './features/profile/profile.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { SuggestedComponent } from './shared/components/suggested/suggested.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        component: LoginComponent,
        title: 'Login',
      },
      {
        path: 'register',
        component: RegisterComponent,
        title: 'Register',
      },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: HomeComponent,
        title: 'Home',
      },
      {
        path: 'feed',
        redirectTo: 'home',
        pathMatch: 'full',
      },

      {
        path: 'my-posts',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'community',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'saved',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'profile',
        component: ProfileComponent,
        title: 'Profile',
      },
      {
        path: 'profile/:id',
        component: ProfileComponent,
        title: 'Profile',
      },
      {
        path: 'changePassword',
        component: ChangPasswordComponent,
        title: 'Change Password',
      },
      {
        path: 'notifications',
        component: NotificationsComponent,
        title: 'Notifications',
      },
      {
        path: 'suggestions',
        component: SuggestedComponent,
        title: 'Suggestions',
      },
    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
    title: 'Not Found',
  },
];
