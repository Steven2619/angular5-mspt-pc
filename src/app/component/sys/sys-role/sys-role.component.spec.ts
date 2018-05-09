import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SysRoleComponent } from './sys-role.component';

describe('SysRoleComponent', () => {
  let component: SysRoleComponent;
  let fixture: ComponentFixture<SysRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SysRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SysRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
