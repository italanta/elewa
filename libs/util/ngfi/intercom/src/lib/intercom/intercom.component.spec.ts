import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IntercomComponent } from './intercom.component';

describe('IntercomComponent', () => {
  let component: IntercomComponent;
  let fixture: ComponentFixture<IntercomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntercomComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IntercomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
