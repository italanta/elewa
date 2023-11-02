import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyConfigComponent } from './survey-config.component';

describe('SurveyConfigComponent', () => {
  let component: SurveyConfigComponent;
  let fixture: ComponentFixture<SurveyConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SurveyConfigComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
