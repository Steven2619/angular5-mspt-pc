import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserModalInfoComponent } from './user-modal-info.component';

describe('UserModalInfoComponent', () => {
  let component: UserModalInfoComponent;
  let fixture: ComponentFixture<UserModalInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserModalInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserModalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
