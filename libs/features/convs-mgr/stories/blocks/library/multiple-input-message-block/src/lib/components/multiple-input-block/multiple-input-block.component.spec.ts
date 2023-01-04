import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleInputBlockComponent } from './multiple-input-block.component';

describe('MultipleInputBlockComponent', () => {
  let component: MultipleInputBlockComponent;
  let fixture: ComponentFixture<MultipleInputBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MultipleInputBlockComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MultipleInputBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
