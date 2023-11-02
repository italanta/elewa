import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendModalComponent } from './send-modal.component';

describe('SendModalComponent', () => {
  let component: SendModalComponent;
  let fixture: ComponentFixture<SendModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SendModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SendModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
