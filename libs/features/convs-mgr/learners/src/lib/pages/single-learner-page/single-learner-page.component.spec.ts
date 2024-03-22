import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleLearnerPageComponent } from './single-learner-page.component';

describe('SingleLearnerPageComponent', () => {
  let component: SingleLearnerPageComponent;
  let fixture: ComponentFixture<SingleLearnerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SingleLearnerPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SingleLearnerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
