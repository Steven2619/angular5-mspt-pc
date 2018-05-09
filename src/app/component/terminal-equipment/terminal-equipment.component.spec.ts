import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalEquipmentComponent } from './terminal-equipment.component';

describe('TerminalEquipmentComponent', () => {
  let component: TerminalEquipmentComponent;
  let fixture: ComponentFixture<TerminalEquipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminalEquipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminalEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
