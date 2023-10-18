import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyQuestionComponent } from './survey-question.component';

describe('SurveyQuestionComponent', () => {
  let component: SurveyQuestionComponent;
  let fixture: ComponentFixture<SurveyQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SurveyQuestionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
