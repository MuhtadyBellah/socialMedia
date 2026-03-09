import { Component, Input } from '@angular/core';
import { SinglePostComponent } from '../single-post/single-post.component';

@Component({
  selector: 'app-profile-posts',
  imports: [SinglePostComponent],
  templateUrl: './profile-posts.component.html',
  styleUrl: './profile-posts.component.css',
})
export class ProfilePostsComponent {
  @Input({ required: true }) mode: 'posts' | 'saved' = 'posts';
  @Input() posts = [];
}
