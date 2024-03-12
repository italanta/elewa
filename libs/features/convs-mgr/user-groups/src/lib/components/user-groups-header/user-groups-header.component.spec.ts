import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGroupsHeaderComponent } from './user-groups-header.component';

describe('UserGroupsHeaderComponent', () => {
  let component: UserGroupsHeaderComponent;
  let fixture: ComponentFixture<UserGroupsHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserGroupsHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserGroupsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
