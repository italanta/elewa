import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnerEnrolledCoursesComponent } from './learner-enrolled-courses.component';

describe('LearnerEnrolledCoursesComponent', () => {
  let component: LearnerEnrolledCoursesComponent;
  let fixture: ComponentFixture<LearnerEnrolledCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LearnerEnrolledCoursesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LearnerEnrolledCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
