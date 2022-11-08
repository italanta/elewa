import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBotModalComponent } from './create-bot-modal.component';

describe('CreateBotModalComponent', () => {
  let component: CreateBotModalComponent;
  let fixture: ComponentFixture<CreateBotModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateBotModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateBotModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
