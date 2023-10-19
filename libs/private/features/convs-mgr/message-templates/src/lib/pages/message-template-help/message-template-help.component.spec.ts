import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageTemplateHelpComponent } from './message-template-help.component';

describe('MessageTemplateHelpComponent', () => {
  let component: MessageTemplateHelpComponent;
  let fixture: ComponentFixture<MessageTemplateHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MessageTemplateHelpComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageTemplateHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
