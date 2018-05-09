import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWellComponent } from './add-well.component';

describe('AddWellComponent', () => {
  let component: AddWellComponent;
  let fixture: ComponentFixture<AddWellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddWellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
