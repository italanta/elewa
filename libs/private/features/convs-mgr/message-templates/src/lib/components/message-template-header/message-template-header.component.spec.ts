import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageTemplateHeaderComponent } from './message-template-header.component';

describe('MessageTemplateHeaderComponent', () => {
  let component: MessageTemplateHeaderComponent;
  let fixture: ComponentFixture<MessageTemplateHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MessageTemplateHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageTemplateHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
