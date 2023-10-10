import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageTemplateSingleComponent } from './message-template-single.component';

describe('MessageTemplateSingleComponent', () => {
  let component: MessageTemplateSingleComponent;
  let fixture: ComponentFixture<MessageTemplateSingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MessageTemplateSingleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageTemplateSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
