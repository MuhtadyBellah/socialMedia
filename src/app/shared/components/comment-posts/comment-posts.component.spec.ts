import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentPostsComponent } from './comment-posts.component';

describe('CommentPostsComponent', () => {
  let component: CommentPostsComponent;
  let fixture: ComponentFixture<CommentPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentPostsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentPostsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
