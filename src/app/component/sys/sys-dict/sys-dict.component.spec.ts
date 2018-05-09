import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SysDictComponent } from './sys-dict.component';

describe('SysDictComponent', () => {
  let component: SysDictComponent;
  let fixture: ComponentFixture<SysDictComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SysDictComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SysDictComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
