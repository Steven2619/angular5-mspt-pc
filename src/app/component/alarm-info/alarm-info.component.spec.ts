import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmInfoComponent } from './alarm-info.component';

describe('AlarmInfoComponent', () => {
  let component: AlarmInfoComponent;
  let fixture: ComponentFixture<AlarmInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
