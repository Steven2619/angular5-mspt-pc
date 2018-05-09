import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintWorkOrderComponent } from './maint-work-order.component';

describe('MaintWorkOrderComponent', () => {
  let component: MaintWorkOrderComponent;
  let fixture: ComponentFixture<MaintWorkOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintWorkOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintWorkOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
