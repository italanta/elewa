import { TestBed } from '@angular/core/testing';

import { SurveyMetricsService } from './survey-metrics.service';

describe('SurveyMetricsService', () => {
  let service: SurveyMetricsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SurveyMetricsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
