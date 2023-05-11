import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentEditComponent } from './assessment-edit.component';

describe('AssessmentEditComponent', () => {
  let component: AssessmentEditComponent;
  let fixture: ComponentFixture<AssessmentEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssessmentEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssessmentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
