import { NgClass } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgClass],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css',
})
export class AuthLayoutComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  private readonly currentSegment = signal<string>('login');
  isLoginActive = computed(() => this.currentSegment() === 'login');

  constructor() {
    this.route.firstChild?.url
      .pipe(
        map((url) => (url && url.length > 0 ? url[0].path : 'login')),
        startWith('login'),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((segment) => this.currentSegment.set(segment));
  }
}
