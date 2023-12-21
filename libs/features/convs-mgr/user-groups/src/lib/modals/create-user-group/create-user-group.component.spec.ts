import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUserGroupComponent } from './create-user-group.component';

describe('CreateUserGroupComponent', () => {
  let component: CreateUserGroupComponent;
  let fixture: ComponentFixture<CreateUserGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateUserGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUserGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
