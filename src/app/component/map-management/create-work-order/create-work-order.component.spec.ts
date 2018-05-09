import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWorkOrderComponent } from './create-work-order.component';

describe('CreateWorkOrderComponent', () => {
  let component: CreateWorkOrderComponent;
  let fixture: ComponentFixture<CreateWorkOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateWorkOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWorkOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
