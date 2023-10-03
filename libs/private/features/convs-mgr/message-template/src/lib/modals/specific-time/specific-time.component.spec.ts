import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificTimeComponent } from './specific-time.component';

describe('SpecificTimeComponent', () => {
  let component: SpecificTimeComponent;
  let fixture: ComponentFixture<SpecificTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpecificTimeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SpecificTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
