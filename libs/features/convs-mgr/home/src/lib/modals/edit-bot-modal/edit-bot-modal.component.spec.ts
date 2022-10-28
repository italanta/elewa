import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBotModalComponent } from './edit-bot-modal.component';

describe('EditBotModalComponent', () => {
  let component: EditBotModalComponent;
  let fixture: ComponentFixture<EditBotModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditBotModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditBotModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
