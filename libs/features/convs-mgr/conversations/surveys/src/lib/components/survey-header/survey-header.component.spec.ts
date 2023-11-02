import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyHeaderComponent } from './survey-header.component';

describe('SurveyHeaderComponent', () => {
  let component: SurveyHeaderComponent;
  let fixture: ComponentFixture<SurveyHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SurveyHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
