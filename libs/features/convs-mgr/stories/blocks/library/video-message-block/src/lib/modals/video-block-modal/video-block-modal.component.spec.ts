import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoBlockModalComponent } from './video-block-modal.component';

describe('VideoBlockModalComponent', () => {
  let component: VideoBlockModalComponent;
  let fixture: ComponentFixture<VideoBlockModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoBlockModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoBlockModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
