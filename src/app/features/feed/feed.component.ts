import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PostResponse } from '../../core/models/post.interface';
import { CreatePostComponent } from '../../shared/components/create-post/create-post.component';
import { SinglePostComponent } from '../../shared/components/single-post/single-post.component';

@Component({
  selector: 'app-feed',
  imports: [CreatePostComponent, SinglePostComponent, CommonModule],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css',
})
export class FeedComponent {
  @Input({ required: true }) posts!: PostResponse | any;
}
