import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleGroupHeaderComponent } from './single-group-header.component';

describe('SingleGroupHeaderComponent', () => {
  let component: SingleGroupHeaderComponent;
  let fixture: ComponentFixture<SingleGroupHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SingleGroupHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SingleGroupHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
