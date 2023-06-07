import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentAnswersComponent } from './assessment-answers.component';

describe('AssessmentAnswersComponent', () => {
  let component: AssessmentAnswersComponent;
  let fixture: ComponentFixture<AssessmentAnswersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssessmentAnswersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssessmentAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
