import { TestBed, inject } from '@angular/core/testing';

import { MapManageService } from './map-manage.service';

describe('MapManageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapManageService]
    });
  });

  it('should be created', inject([MapManageService], (service: MapManageService) => {
    expect(service).toBeTruthy();
  }));
});
