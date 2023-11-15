import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeactivateUserComponent } from './deactivate-user.component';

describe('DeactivateUserComponent', () => {
  let component: DeactivateUserComponent;
  let fixture: ComponentFixture<DeactivateUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeactivateUserComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeactivateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
