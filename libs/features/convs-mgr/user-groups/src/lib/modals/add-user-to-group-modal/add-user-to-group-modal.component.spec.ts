import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserToGroupModalComponent } from './add-user-to-group-modal.component';

describe('AddUserToGroupModalComponent', () => {
  let component: AddUserToGroupModalComponent;
  let fixture: ComponentFixture<AddUserToGroupModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddUserToGroupModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddUserToGroupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
