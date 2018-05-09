import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderDetailInfoComponent } from './work-order-detail-info.component';

describe('WorkOrderDetailInfoComponent', () => {
  let component: WorkOrderDetailInfoComponent;
  let fixture: ComponentFixture<WorkOrderDetailInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkOrderDetailInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkOrderDetailInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
