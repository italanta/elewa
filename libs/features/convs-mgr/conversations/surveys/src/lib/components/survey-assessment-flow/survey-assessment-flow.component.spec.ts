import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyAssessmentFlowComponent } from './survey-assessment-flow.component';

describe('SurveyAssessmentFlowComponent', () => {
  let component: SurveyAssessmentFlowComponent;
  let fixture: ComponentFixture<SurveyAssessmentFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SurveyAssessmentFlowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyAssessmentFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
