import { TestBed } from '@angular/core/testing';

import { SurveyFormService } from './survey-form.service';

describe('SurveyFormService', () => {
  let service: SurveyFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SurveyFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
