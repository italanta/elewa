import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyQuestionFormsComponent } from './survey-question-forms.component';

describe('SurveyQuestionFormsComponent', () => {
  let component: SurveyQuestionFormsComponent;
  let fixture: ComponentFixture<SurveyQuestionFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SurveyQuestionFormsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyQuestionFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
