import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneValidationsComponent } from './phone-validations.component';

describe('PhoneValidationsComponent', () => {
  let component: PhoneValidationsComponent;
  let fixture: ComponentFixture<PhoneValidationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PhoneValidationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PhoneValidationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
