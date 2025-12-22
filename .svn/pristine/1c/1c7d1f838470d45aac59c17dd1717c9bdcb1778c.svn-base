import { Component, OnInit, Input } from '@angular/core';
import { PromptResponseEnum } from 'src/app/shared/enum-util';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'confirmation-popup',
  templateUrl: './confirmation-popup.component.html',
  styleUrls: ['./confirmation-popup.component.css']
})
export class ConfirmationPopupComponent implements OnInit {

  @Input() promptHeading:string;
  @Input() promptMessage:string;
  @Input() alertType:string="info";
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }
  yesClick(){
    this.activeModal.close(PromptResponseEnum.YES)
  }

  noClick(){
    this.activeModal.close(PromptResponseEnum.NO)
  }
}
