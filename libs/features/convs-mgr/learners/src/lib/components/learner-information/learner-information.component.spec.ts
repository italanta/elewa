import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnerInformationComponent } from './learner-information.component';

describe('LearnerInformationComponent', () => {
  let component: LearnerInformationComponent;
  let fixture: ComponentFixture<LearnerInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LearnerInformationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LearnerInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
