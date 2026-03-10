import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PostData } from '../../core/models/post.interface';
import { CreatePostComponent } from '../../shared/components/create-post/create-post.component';
import { SinglePostComponent } from '../../shared/components/single-post/single-post.component';

@Component({
  selector: 'app-feed',
  imports: [SinglePostComponent, CommonModule, CreatePostComponent],
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
})
export class FeedComponent {
  @Input({ required: true }) posts!: PostData[];
}
