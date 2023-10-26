import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificTimeModalComponent } from './specific-time-modal.component';

describe('SpecificTimeModalComponent', () => {
  let component: SpecificTimeModalComponent;
  let fixture: ComponentFixture<SpecificTimeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpecificTimeModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SpecificTimeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
