import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorPromptModalComponent } from './error-prompt-modal.component';

describe('ErrorPromptModalComponent', () => {
  let component: ErrorPromptModalComponent;
  let fixture: ComponentFixture<ErrorPromptModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ErrorPromptModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorPromptModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
