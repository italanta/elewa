import { TestBed } from '@angular/core/testing';

import { MessageTemplateService } from './message-template.service';

describe('MessageTemplateService', () => {
  let service: MessageTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
