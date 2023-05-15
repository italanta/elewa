import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentAnswerComponent } from './assessment-answer.component';

describe('AssessmentAnswerComponent', () => {
  let component: AssessmentAnswerComponent;
  let fixture: ComponentFixture<AssessmentAnswerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssessmentAnswerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssessmentAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
