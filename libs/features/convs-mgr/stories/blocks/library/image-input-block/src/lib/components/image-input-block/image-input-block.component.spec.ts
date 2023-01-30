import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageInputBlockComponent } from './image-input-block.component';

describe('ImageInputBlockComponent', () => {
  let component: ImageInputBlockComponent;
  let fixture: ComponentFixture<ImageInputBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImageInputBlockComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageInputBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
