import { TestBed, inject } from '@angular/core/testing';

import { ActiveAlarmService } from './active-alarm.service';

describe('ActiveAlarmService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActiveAlarmService]
    });
  });

  it('should be created', inject([ActiveAlarmService], (service: ActiveAlarmService) => {
    expect(service).toBeTruthy();
  }));
});
