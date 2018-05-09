import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorkOrderComponent } from './add-work-order.component';

describe('AddWorkOrderComponent', () => {
  let component: AddWorkOrderComponent;
  let fixture: ComponentFixture<AddWorkOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddWorkOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWorkOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
