import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapManagementComponent } from './map-management.component';

describe('MapManagementComponent', () => {
  let component: MapManagementComponent;
  let fixture: ComponentFixture<MapManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
