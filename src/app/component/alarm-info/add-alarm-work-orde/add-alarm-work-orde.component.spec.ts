import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAlarmWorkOrdeComponent } from './add-alarm-work-orde.component';

describe('AddAlarmWorkOrdeComponent', () => {
  let component: AddAlarmWorkOrdeComponent;
  let fixture: ComponentFixture<AddAlarmWorkOrdeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAlarmWorkOrdeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAlarmWorkOrdeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
