import { TestBed, inject } from '@angular/core/testing';

import { SysManageService } from './sys-manage.service';

describe('SysManageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SysManageService]
    });
  });

  it('should be created', inject([SysManageService], (service: SysManageService) => {
    expect(service).toBeTruthy();
  }));
});
