import { TestBed, inject } from '@angular/core/testing';

import { EquipmentMessageService } from './equipment-message.service';

describe('EquipmentMessageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EquipmentMessageService]
    });
  });

  it('should be created', inject([EquipmentMessageService], (service: EquipmentMessageService) => {
    expect(service).toBeTruthy();
  }));
});
