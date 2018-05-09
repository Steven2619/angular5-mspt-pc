import { TestBed, inject } from '@angular/core/testing';

import { TerminalWellService } from './terminal-well.service';

describe('TerminalWellService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TerminalWellService]
    });
  });

  it('should be created', inject([TerminalWellService], (service: TerminalWellService) => {
    expect(service).toBeTruthy();
  }));
});
