import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentQuestionsComponent } from './assessment-question-forms.component';

describe('AssessmentQuestionsComponent', () => {
  let component: AssessmentQuestionsComponent;
  let fixture: ComponentFixture<AssessmentQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssessmentQuestionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssessmentQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
