import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFirstBotComponent } from './create-first-bot.component';

describe('CreateFirstBotComponent', () => {
  let component: CreateFirstBotComponent;
  let fixture: ComponentFixture<CreateFirstBotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateFirstBotComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateFirstBotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
