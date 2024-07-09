import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StateConvsMgrWflowsMainComponent } from './state-convs-mgr-wflows-main.component';

describe('StateConvsMgrWflowsMainComponent', () => {
  let component: StateConvsMgrWflowsMainComponent;
  let fixture: ComponentFixture<StateConvsMgrWflowsMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StateConvsMgrWflowsMainComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StateConvsMgrWflowsMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
