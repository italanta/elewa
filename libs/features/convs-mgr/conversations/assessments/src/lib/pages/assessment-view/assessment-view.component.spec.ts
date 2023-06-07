import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentViewComponent } from './assessment-view.component';

describe('AssessmentViewComponent', () => {
  let component: AssessmentViewComponent;
  let fixture: ComponentFixture<AssessmentViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssessmentViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssessmentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
