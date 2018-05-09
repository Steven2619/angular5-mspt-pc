import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationWorkOrderComponent } from './operation-work-order.component';

describe('OperationWorkOrderComponent', () => {
  let component: OperationWorkOrderComponent;
  let fixture: ComponentFixture<OperationWorkOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationWorkOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationWorkOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
