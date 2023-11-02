import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MilestoneReachedModalComponent } from './milestone-reached-modal.component';

describe('MilestoneReachedModalComponent', () => {
  let component: MilestoneReachedModalComponent;
  let fixture: ComponentFixture<MilestoneReachedModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MilestoneReachedModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MilestoneReachedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
