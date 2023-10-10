import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageTemplateCreateComponent } from './message-template-create.component';

describe('MessageTemplateCreateComponent', () => {
  let component: MessageTemplateCreateComponent;
  let fixture: ComponentFixture<MessageTemplateCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MessageTemplateCreateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageTemplateCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
