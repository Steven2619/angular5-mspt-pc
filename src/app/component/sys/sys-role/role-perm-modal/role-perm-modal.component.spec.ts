import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolePermModalComponent } from './role-perm-modal.component';

describe('RolePermModalComponent', () => {
  let component: RolePermModalComponent;
  let fixture: ComponentFixture<RolePermModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolePermModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolePermModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
