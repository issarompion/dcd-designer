import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DcdUiAngularComponent } from './dcd-ui-angular.component';

describe('DcdUiAngularComponent', () => {
  let component: DcdUiAngularComponent;
  let fixture: ComponentFixture<DcdUiAngularComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DcdUiAngularComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DcdUiAngularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
