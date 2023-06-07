import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentConfigComponent } from './assessment-config.component';

describe('AssessmentConfigComponent', () => {
  let component: AssessmentConfigComponent;
  let fixture: ComponentFixture<AssessmentConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssessmentConfigComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssessmentConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
