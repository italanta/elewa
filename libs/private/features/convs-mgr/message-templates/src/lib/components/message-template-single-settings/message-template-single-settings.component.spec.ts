import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageTemplateSingleSettingsComponent } from './message-template-single-settings.component';

describe('MessageTemplateSingleSettingsComponent', () => {
  let component: MessageTemplateSingleSettingsComponent;
  let fixture: ComponentFixture<MessageTemplateSingleSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MessageTemplateSingleSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageTemplateSingleSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
