import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentQuestionComponent } from './assessment-question.component';

describe('AssessmentQuestionComponent', () => {
  let component: AssessmentQuestionComponent;
  let fixture: ComponentFixture<AssessmentQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssessmentQuestionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssessmentQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
