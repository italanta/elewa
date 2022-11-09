import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteBotModalComponent } from './delete-bot-modal.component';

describe('DeleteBotModalComponent', () => {
  let component: DeleteBotModalComponent;
  let fixture: ComponentFixture<DeleteBotModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteBotModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteBotModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
