import { TestBed } from '@angular/core/testing';

import { PropicService } from './propic.service';

describe('PropicService', () => {
  let service: PropicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
