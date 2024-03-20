import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleUserGroupComponent } from './single-user-group.component';

describe('SingleUserGroupComponent', () => {
  let component: SingleUserGroupComponent;
  let fixture: ComponentFixture<SingleUserGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SingleUserGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SingleUserGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
