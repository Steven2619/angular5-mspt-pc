import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SysPermissionComponent } from './sys-permission.component';

describe('SysPermissionComponent', () => {
  let component: SysPermissionComponent;
  let fixture: ComponentFixture<SysPermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SysPermissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SysPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
