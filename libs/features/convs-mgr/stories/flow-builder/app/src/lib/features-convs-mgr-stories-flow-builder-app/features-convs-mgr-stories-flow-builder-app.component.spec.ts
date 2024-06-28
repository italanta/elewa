import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeaturesConvsMgrStoriesFlowBuilderAppComponent } from './features-convs-mgr-stories-flow-builder-app.component';

describe('FeaturesConvsMgrStoriesFlowBuilderAppComponent', () => {
  let component: FeaturesConvsMgrStoriesFlowBuilderAppComponent;
  let fixture: ComponentFixture<FeaturesConvsMgrStoriesFlowBuilderAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturesConvsMgrStoriesFlowBuilderAppComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      FeaturesConvsMgrStoriesFlowBuilderAppComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
