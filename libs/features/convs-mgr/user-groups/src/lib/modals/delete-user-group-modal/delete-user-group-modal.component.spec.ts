import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteUserGroupModalComponent } from './delete-user-group-modal.component';

describe('DeleteUserGroupModalComponent', () => {
  let component: DeleteUserGroupModalComponent;
  let fixture: ComponentFixture<DeleteUserGroupModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteUserGroupModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteUserGroupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
