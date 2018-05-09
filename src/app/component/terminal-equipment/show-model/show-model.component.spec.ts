import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowModelComponent } from './show-model.component';

describe('ShowModelComponent', () => {
  let component: ShowModelComponent;
  let fixture: ComponentFixture<ShowModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
