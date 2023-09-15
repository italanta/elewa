import { TestBed } from '@angular/core/testing';

import { CheckStoryErrorsService } from './check-story-errors.service';

describe('CheckStoryErrorsService', () => {
  let service: CheckStoryErrorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckStoryErrorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
