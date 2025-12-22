import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabResultsResultsComponent } from './lab-results-results.component';

describe('LabResultsResultsComponent', () => {
  let component: LabResultsResultsComponent;
  let fixture: ComponentFixture<LabResultsResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabResultsResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabResultsResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
