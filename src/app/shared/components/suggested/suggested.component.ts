import { Component, inject, Input } from '@angular/core';
import { SuggestedUser } from '../../../core/auth/models/auth.interface';
import { NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-suggested',
  imports: [NgClass, RouterLink],
  templateUrl: './suggested.component.html',
  styleUrl: './suggested.component.css',
})
export class SuggestedComponent {
  @Input() mode: 'sidebar' | 'full' = 'full';
  private readonly router = inject(Router);

  @Input() users: SuggestedUser[] = [
    {
      name: 'Ahmed Bahnasy',
      handle: '@bahnasy20222',
      avatar:
        'https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/1771018057253-2285ec56-8e3c-4ea3-9ee4-c235037ffffe-Screenshot-2026-02-13-at-11.27.15---PM.png',
      followers: 234,
    },
    {
      name: 'Ahmed Abd Al-Muti',
      handle: '@ahmedmutti',
      avatar:
        'https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/1771038591307-b70f2a83-d052-400d-a8ea-5c601b51e262-WhatsApp-Image-2026-01-21-at-05.00.10.jpeg',
      followers: 149,
    },
    {
      name: 'Nourhan',
      handle: '@nourhan',
      avatar:
        'https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/1771068100123-c9bbeba4-0e5f-4246-811e-add6e4890e40-DSC07722.webp',
      followers: 80,
    },
    {
      name: 'mohamed',
      handle: 'route user',
      avatar: 'https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png',
      followers: 71,
    },
  ];

  viewMore() {
    if (this.mode === 'sidebar') {
      this.router.navigate(['/suggestions']);
    }
  }
}
