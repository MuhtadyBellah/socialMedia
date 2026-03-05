import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePostsComponent } from './profile-posts.component';

describe('ProfilePostsComponent', () => {
  let component: ProfilePostsComponent;
  let fixture: ComponentFixture<ProfilePostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePostsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilePostsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
