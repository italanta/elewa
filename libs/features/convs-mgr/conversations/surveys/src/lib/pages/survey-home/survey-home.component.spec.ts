import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyHomeComponent } from './survey-home.component';

describe('SurveyHomeComponent', () => {
  let component: SurveyHomeComponent;
  let fixture: ComponentFixture<SurveyHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SurveyHomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
