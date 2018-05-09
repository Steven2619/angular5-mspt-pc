import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SysdictModalComponent } from './sysdict-modal.component';

describe('SysdictModalComponent', () => {
  let component: SysdictModalComponent;
  let fixture: ComponentFixture<SysdictModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SysdictModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SysdictModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
