import { Component, Inject, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LOOKUP_LIST, LookupList } from 'src/app/providers/lookupList.module';
import { GeneralOperation } from 'src/app/shared/generalOperation';
import { LogMessage } from 'src/app/shared/log-message';

@Component({
    selector: 'setting-main',
    templateUrl: './setting-main.component.html',
    styleUrls: ['./setting-main.component.css'],
    standalone: false
})
export class SettingMainComponent implements OnInit {

  module_name: string = 'authorized_apps';
  constructor(@Inject(LOOKUP_LIST) public lookupList: LookupList
    , private generalOperation: GeneralOperation) { }

  ngOnInit() {
    this.openModule('authorized_apps');
  }
  openModule(module: string) {
    console.log(module);
    this.module_name = module;
    let log_module_name = '';
    switch (module) {
      case 'authorized_apps':
        log_module_name = 'Authorized Applications';
        break;

    }
    this.generalOperation.updateLog(log_module_name, this.lookupList.patientInfo.patient_id, "Access", "");
  }

}
