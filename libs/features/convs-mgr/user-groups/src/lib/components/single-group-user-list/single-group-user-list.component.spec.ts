import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleGroupUserListComponent } from './single-group-user-list.component';

describe('SingleGroupUserListComponent', () => {
  let component: SingleGroupUserListComponent;
  let fixture: ComponentFixture<SingleGroupUserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SingleGroupUserListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SingleGroupUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
