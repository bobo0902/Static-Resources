import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Frame1Component } from './frame.component';

describe('Frame1Component', () => {
  let component: Frame1Component;
  let fixture: ComponentFixture<Frame1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Frame1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Frame1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
