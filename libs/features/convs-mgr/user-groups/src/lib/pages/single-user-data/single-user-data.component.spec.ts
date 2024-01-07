import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleUserDataComponent } from './single-user-data.component';

describe('SingleUserDataComponent', () => {
  let component: SingleUserDataComponent;
  let fixture: ComponentFixture<SingleUserDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SingleUserDataComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SingleUserDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
