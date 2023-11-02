import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageTemplateHomeComponent } from './message-template-home.component';

describe('MessageTemplateHomeComponent', () => {
  let component: MessageTemplateHomeComponent;
  let fixture: ComponentFixture<MessageTemplateHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MessageTemplateHomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageTemplateHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
