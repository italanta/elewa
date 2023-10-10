import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageTemplateFormComponent } from './message-template-form.component';

describe('MessageTemplateFormComponent', () => {
  let component: MessageTemplateFormComponent;
  let fixture: ComponentFixture<MessageTemplateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MessageTemplateFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageTemplateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
