import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeaturesConvsMgrStoriesBuilderFlowBuilderStateComponent } from './features-convs-mgr-stories-builder-flow-builder-state.component';

describe('FeaturesConvsMgrStoriesBuilderFlowBuilderStateComponent', () => {
  let component: FeaturesConvsMgrStoriesBuilderFlowBuilderStateComponent;
  let fixture: ComponentFixture<FeaturesConvsMgrStoriesBuilderFlowBuilderStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturesConvsMgrStoriesBuilderFlowBuilderStateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      FeaturesConvsMgrStoriesBuilderFlowBuilderStateComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
