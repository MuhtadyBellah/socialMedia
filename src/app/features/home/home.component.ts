import { Component } from '@angular/core';
import { FeedComponent } from '../feed/feed.component';
import { SuggestedComponent } from '../../shared/components/suggested/suggested.component';

@Component({
  selector: 'app-home',
  imports: [FeedComponent, SuggestedComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
