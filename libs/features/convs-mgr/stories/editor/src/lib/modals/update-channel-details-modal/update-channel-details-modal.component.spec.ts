import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateChannelDetailsModalComponent } from './update-channel-details-modal.component';

describe('UpdateChannelDetailsModalComponent', () => {
  let component: UpdateChannelDetailsModalComponent;
  let fixture: ComponentFixture<UpdateChannelDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateChannelDetailsModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateChannelDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
