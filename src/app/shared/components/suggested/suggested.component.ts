import { NgClass } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SuggestionResponse } from '../../../core/models/suggestion.interface';

@Component({
  selector: 'app-suggested',
  imports: [NgClass, RouterLink],
  templateUrl: './suggested.component.html',
  styleUrl: './suggested.component.css',
})
export class SuggestedComponent {
  @Input() mode: 'sidebar' | 'full' = 'full';
  private readonly router = inject(Router);

  @Input() users: SuggestionResponse[] = [];

  viewMore() {
    if (this.mode === 'sidebar') {
      this.router.navigate(['/suggestions']);
    }
  }
}
