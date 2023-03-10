import { TestBed } from '@angular/core/testing';

import { MarkerDataService } from './marker-data-service.service';

describe('MarkerDataServiceService', () => {
  let service: MarkerDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarkerDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
