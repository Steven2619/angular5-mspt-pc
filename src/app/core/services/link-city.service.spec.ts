import { TestBed, inject } from '@angular/core/testing';

import { LinkCityService } from './link-city.service';

describe('LinkCityService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LinkCityService]
    });
  });

  it('should be created', inject([LinkCityService], (service: LinkCityService) => {
    expect(service).toBeTruthy();
  }));
});
