import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentQuestionFormComponent } from './components/assessment-question-form/assessment-question-form.component';

describe('AssessmentQuestionFormComponent', () => {
  let component: AssessmentQuestionFormComponent;
  let fixture: ComponentFixture<AssessmentQuestionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssessmentQuestionFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssessmentQuestionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
