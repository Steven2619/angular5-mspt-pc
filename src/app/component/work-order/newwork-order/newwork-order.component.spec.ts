import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewworkOrderComponent } from './newwork-order.component';

describe('NewworkOrderComponent', () => {
  let component: NewworkOrderComponent;
  let fixture: ComponentFixture<NewworkOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewworkOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewworkOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
