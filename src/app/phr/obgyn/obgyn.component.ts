import { Component, OnInit, Inject } from '@angular/core';
import { PhrService } from 'src/app/services/phr/phr.service';
import { LookupList, LOOKUP_LIST } from 'src/app/providers/lookupList.module';

@Component({
    selector: 'obgyn',
    templateUrl: './obgyn.component.html',
    styleUrls: ['./obgyn.component.css'],
    standalone: false
})
export class ObgynComponent implements OnInit {

  lstPHRGyn: Array<any>;

  constructor(private phrService:PhrService,
    @Inject(LOOKUP_LIST) public lookupList: LookupList) { }

  ngOnInit() {
    this.getGynMain();
  }
  getGynMain(){
    this.phrService.getGynMain(this.lookupList.patientInfo.patient_id).subscribe(
      data => {
        lstPHRGyn: new Array();
        this.lstPHRGyn = data as Array<any>;
      },
      error => {
        return;
      }
    );
  }

}
