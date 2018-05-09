import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigInfoComponent } from './config-info.component';

describe('ConfigInfoComponent', () => {
  let component: ConfigInfoComponent;
  let fixture: ComponentFixture<ConfigInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
