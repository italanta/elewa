import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeaturesConvsMgrStoriesModulesBasedComponent } from './features-convs-mgr-stories-modules-based.component';

describe('FeaturesConvsMgrStoriesModulesBasedComponent', () => {
  let component: FeaturesConvsMgrStoriesModulesBasedComponent;
  let fixture: ComponentFixture<FeaturesConvsMgrStoriesModulesBasedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturesConvsMgrStoriesModulesBasedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      FeaturesConvsMgrStoriesModulesBasedComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
