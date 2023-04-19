import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrickBlockComponent } from './brick-block.component';

describe('BrickBlockComponent', () => {
  let component: BrickBlockComponent;
  let fixture: ComponentFixture<BrickBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BrickBlockComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BrickBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
