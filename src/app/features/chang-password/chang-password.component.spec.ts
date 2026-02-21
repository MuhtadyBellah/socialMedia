import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangPasswordComponent } from './chang-password.component';

describe('ChangPasswordComponent', () => {
  let component: ChangPasswordComponent;
  let fixture: ComponentFixture<ChangPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangPasswordComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
