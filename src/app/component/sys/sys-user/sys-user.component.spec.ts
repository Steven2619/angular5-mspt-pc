import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SysUserComponent } from './sys-user.component';

describe('SysUserComponent', () => {
  let component: SysUserComponent;
  let fixture: ComponentFixture<SysUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SysUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SysUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
