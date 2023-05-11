import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentListItemComponent } from './assessment-list-item.component';

describe('AssessmentListItemComponent', () => {
  let component: AssessmentListItemComponent;
  let fixture: ComponentFixture<AssessmentListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssessmentListItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssessmentListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
