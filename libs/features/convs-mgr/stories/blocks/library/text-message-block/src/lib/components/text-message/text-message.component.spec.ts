import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextMessageComponent } from './text-message.component';

describe('TextMessageComponent', () => {
  let component: TextMessageComponent;
  let fixture: ComponentFixture<TextMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextMessageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
