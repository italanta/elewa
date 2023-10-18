import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfterInactivityModalComponent } from './after-inactivity-modal.component';

describe('AfterInactivityModalComponent', () => {
  let component: AfterInactivityModalComponent;
  let fixture: ComponentFixture<AfterInactivityModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AfterInactivityModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AfterInactivityModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
