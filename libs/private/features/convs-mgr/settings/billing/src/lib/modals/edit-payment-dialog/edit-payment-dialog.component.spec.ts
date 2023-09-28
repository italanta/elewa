import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPaymentDialogComponent } from './edit-payment-dialog.component';

describe('EditPaymentDialogComponent', () => {
  let component: EditPaymentDialogComponent;
  let fixture: ComponentFixture<EditPaymentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditPaymentDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditPaymentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
