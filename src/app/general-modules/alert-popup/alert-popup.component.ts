import { Component, OnInit, Input } from '@angular/core';
import { AlertTypeEnum, PromptResponseEnum } from 'src/app/shared/enum-util';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'alert-popup',
    templateUrl: './alert-popup.component.html',
    styleUrls: ['./alert-popup.component.css'],
    standalone: false
})
export class AlertPopupComponent implements OnInit {
  @Input() promptHeading:string;
  @Input() promptMessage:string;
  @Input() alertType:string=AlertTypeEnum.INFO;
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }
  okClicked(){
    this.activeModal.close(PromptResponseEnum.OK); 
   }
}
