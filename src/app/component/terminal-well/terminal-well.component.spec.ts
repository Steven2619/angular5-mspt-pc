import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalWellComponent } from './terminal-well.component';

describe('TerminalWellComponent', () => {
  let component: TerminalWellComponent;
  let fixture: ComponentFixture<TerminalWellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminalWellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminalWellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
