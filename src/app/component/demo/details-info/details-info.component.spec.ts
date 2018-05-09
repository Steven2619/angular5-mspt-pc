import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsInfoComponent } from './details-info.component';

describe('DetailsInfoComponent', () => {
  let component: DetailsInfoComponent;
  let fixture: ComponentFixture<DetailsInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
