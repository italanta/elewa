import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyListViewComponent } from './survey-list-view.component';

describe('SurveyListViewComponent', () => {
  let component: SurveyListViewComponent;
  let fixture: ComponentFixture<SurveyListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SurveyListViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
