import { TestBed } from '@angular/core/testing';

import { LabelsStateService } from './labels-state.service';

describe('LabelsStateService', () => {
  let service: LabelsStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LabelsStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
