import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { PhrService } from 'src/app/services/phr/phr.service';

@Component({
  selector: 'phr-lab-result',
  templateUrl: './phr-lab-result.component.html',
  styleUrls: ['./phr-lab-result.component.css']
})
export class PhrLabResultComponent implements OnInit {

  @Output() BackToPhrSummary = new EventEmitter<any>();
  //@Input() objReply;
  @Input() orderID;
  lstPHRLabOrderResult: Array<any>;
  constructor(private phrService:PhrService) { }

  ngOnInit() {
    this.getSelectedPHRLabOrderResult();
  }
  getSelectedPHRLabOrderResult(){
      this.phrService.getSelectedPHRLabOrderResult(this.orderID).subscribe(
        data => {
          lstPHRLabOrderResult: new Array();
          this.lstPHRLabOrderResult = data as Array<any>;
        },
        error => {
          return;
        }
      );
  }
}
