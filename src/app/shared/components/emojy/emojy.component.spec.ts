import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmojyComponent } from './emojy.component';

describe('EmojyComponent', () => {
  let component: EmojyComponent;
  let fixture: ComponentFixture<EmojyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmojyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmojyComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
