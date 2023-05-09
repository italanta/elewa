import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentPaginatorComponent } from './assessment-paginator.component';

describe('AssessmentPaginatorComponent', () => {
  let component: AssessmentPaginatorComponent;
  let fixture: ComponentFixture<AssessmentPaginatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssessmentPaginatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssessmentPaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
