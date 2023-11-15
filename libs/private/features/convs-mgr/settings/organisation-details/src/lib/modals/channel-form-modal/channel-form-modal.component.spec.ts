import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelFormModalComponent } from './channel-form-modal.component';

describe('ChannelFormModalComponent', () => {
  let component: ChannelFormModalComponent;
  let fixture: ComponentFixture<ChannelFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChannelFormModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChannelFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
