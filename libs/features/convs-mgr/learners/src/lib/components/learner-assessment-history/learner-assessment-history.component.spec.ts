import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnerAssessmentHistoryComponent } from './learner-assessment-history.component';

describe('LearnerAssessmentHistoryComponent', () => {
  let component: LearnerAssessmentHistoryComponent;
  let fixture: ComponentFixture<LearnerAssessmentHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LearnerAssessmentHistoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LearnerAssessmentHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
