import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfterInactivityComponent } from './after-inactivity.component';

describe('AfterInactivityComponent', () => {
  let component: AfterInactivityComponent;
  let fixture: ComponentFixture<AfterInactivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AfterInactivityComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AfterInactivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
