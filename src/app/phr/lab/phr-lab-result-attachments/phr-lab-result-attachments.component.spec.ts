import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhrLabResultAttachmentsComponent } from './phr-lab-result-attachments.component';

describe('PhrLabResultAttachmentsComponent', () => {
  let component: PhrLabResultAttachmentsComponent;
  let fixture: ComponentFixture<PhrLabResultAttachmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhrLabResultAttachmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhrLabResultAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
