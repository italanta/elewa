import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentQuestionEditComponent } from './assessment-question-edit.component';

describe('AssessmentQuestionEditComponent', () => {
  let component: AssessmentQuestionEditComponent;
  let fixture: ComponentFixture<AssessmentQuestionEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssessmentQuestionEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssessmentQuestionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
