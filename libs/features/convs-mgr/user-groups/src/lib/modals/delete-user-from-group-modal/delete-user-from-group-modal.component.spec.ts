import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteUserFromGroupModalComponent } from './delete-user-from-group-modal.component';

describe('DeleteUserFromGroupModalComponent', () => {
  let component: DeleteUserFromGroupModalComponent;
  let fixture: ComponentFixture<DeleteUserFromGroupModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteUserFromGroupModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteUserFromGroupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
