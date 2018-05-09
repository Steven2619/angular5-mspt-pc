import { TestBed, inject } from '@angular/core/testing';

import { ConfigDetailService } from './config-detail.service';

describe('ConfigDetailService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfigDetailService]
    });
  });

  it('should be created', inject([ConfigDetailService], (service: ConfigDetailService) => {
    expect(service).toBeTruthy();
  }));
});
