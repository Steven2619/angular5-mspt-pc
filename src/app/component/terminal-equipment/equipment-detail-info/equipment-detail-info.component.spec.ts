import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentDetailInfoComponent } from './equipment-detail-info.component';

describe('EquipmentDetailInfoComponent', () => {
  let component: EquipmentDetailInfoComponent;
  let fixture: ComponentFixture<EquipmentDetailInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentDetailInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentDetailInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
