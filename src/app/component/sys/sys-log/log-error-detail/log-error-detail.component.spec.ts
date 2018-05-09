import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogErrorDetailComponent } from './log-error-detail.component';

describe('LogErrorDetailComponent', () => {
  let component: LogErrorDetailComponent;
  let fixture: ComponentFixture<LogErrorDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogErrorDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogErrorDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
