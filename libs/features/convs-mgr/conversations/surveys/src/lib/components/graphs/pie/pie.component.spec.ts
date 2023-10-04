import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieComponent } from './pie.component';

describe('PieComponent', () => {
  let component: PieComponent;
  let fixture: ComponentFixture<PieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PieComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
