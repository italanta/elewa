import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cmi5BlockComponent } from './cmi5-block.component';

describe('Cmi5BlockComponent', () => {
  let component: Cmi5BlockComponent;
  let fixture: ComponentFixture<Cmi5BlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Cmi5BlockComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Cmi5BlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
