import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalBarComponent } from './horizontal-bar.component';

describe('HorizontalBarComponent', () => {
  let component: HorizontalBarComponent;
  let fixture: ComponentFixture<HorizontalBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HorizontalBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HorizontalBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
