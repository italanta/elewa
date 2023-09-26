import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyGridViewComponent } from './survey-grid-view.component';

describe('SurveyGridViewComponent', () => {
  let component: SurveyGridViewComponent;
  let fixture: ComponentFixture<SurveyGridViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SurveyGridViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyGridViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
