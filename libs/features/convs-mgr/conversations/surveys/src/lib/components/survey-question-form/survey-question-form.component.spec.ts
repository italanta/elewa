import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyQuestionFormComponent } from './survey-question-form.component';

describe('SurveyQuestionFormComponent', () => {
  let component: SurveyQuestionFormComponent;
  let fixture: ComponentFixture<SurveyQuestionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SurveyQuestionFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyQuestionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
