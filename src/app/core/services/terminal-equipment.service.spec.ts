import { TestBed, inject } from '@angular/core/testing';

import { TerminalEquipmentService } from './terminal-equipment.service';

describe('TerminalEquipmentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TerminalEquipmentService]
    });
  });

  it('should be created', inject([TerminalEquipmentService], (service: TerminalEquipmentService) => {
    expect(service).toBeTruthy();
  }));
});
