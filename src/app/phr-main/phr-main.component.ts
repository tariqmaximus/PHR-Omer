import { Component, OnInit, Inject } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationPopupComponent } from '../general-modules/confirmation-popup/confirmation-popup.component';
import { PromptResponseEnum } from '../shared/enum-util';
import { SearchCriteria } from '../models/common/search-criteria';
import { LookupList, LOOKUP_LIST } from '../providers/lookupList.module';
import { DateTimeUtil } from '../shared/date-time-util';
import { PhrService } from '../services/phr/phr.service';
import { LogMessage } from '../shared/log-message';
import { GeneralOperation } from '../shared/generalOperation';
import { PasswordResetComponent } from '../phr/setting/password-reset/password-reset.component';


@Component({
  selector: 'phr-main',
  templateUrl: './phr-main.component.html',
  styleUrls: ['./phr-main.component.css']
})
export class PhrMainComponent implements OnInit {

  constructor(@Inject(LOOKUP_LIST) public lookupList: LookupList, private dateTimeUtil: DateTimeUtil,
    private modalService: NgbModal, private phrService: PhrService, private logMessage: LogMessage
    , private GeneralOperation: GeneralOperation) { }

  poupUpOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false
  };
  ngOnInit() {
    //alert(this.lookupList.logedInUser.acPrintSetting.indexOf('message'));
  }
  onResetPassword() {
    const modalRef = this.modalService.open(PasswordResetComponent, { size: 'sm', windowClass: 'modal-adaptive' });
    let closeResult;
    modalRef.result.then((result) => {
      if (result) {
      }
    }
      , (reason) => {
      });
  }
  logoutUser() {
    const modalRef = this.modalService.open(ConfirmationPopupComponent, this.poupUpOptions);
    modalRef.componentInstance.promptHeading = 'Cofirm Logout!';
    modalRef.componentInstance.promptMessage = 'Are you sure you want to Logout?';
    modalRef.componentInstance.alertType = 'warning';
    let closeResult;
    modalRef.result.then((result) => {

      if (result == PromptResponseEnum.YES) {
        let searchCriteria: SearchCriteria = new SearchCriteria();
        //searchCriteria.practice_id = this.lookupList.practiceInfo.practiceId;
        searchCriteria.param_list = [
          { name: "logOutTime", value: this.dateTimeUtil.getCurrentDateTimeString(), option: "" },
          { name: "logid", value: this.lookupList.loginLogID, option: "" }
        ];
        this.phrService.updatePHRLogout(searchCriteria).subscribe
          (
            data => {
              window.location.reload();
            },
            error => {
              this.logMessage.log("updatePHRLogout " + error);
            }
          );
      }
    }, (reason) => {
      //alert(reason);
    });
  }
  module_name = 'home';
  openModule(module) {
    console.log(module);
    this.module_name = module;
    let log_module_name = '';
    switch (module) {
      case 'home':
        log_module_name = 'Home';
        break;
      case 'encounter':
        log_module_name = 'Encounter';
        break;
      case 'LabSummary':
        log_module_name = 'Lab';
        break;
      case 'messages':
        log_module_name = 'Messages';
        break;
      case 'phi':
        log_module_name = 'PHI';
        break;
      case 'ActivityLog':
        log_module_name = 'Activity Log';
        break;
      case 'LoginLog':
        log_module_name = 'Login Log';
        break;
    }
    this.GeneralOperation.updateLog(log_module_name, this.lookupList.patientInfo.patient_id, "Access", "");
  }
}
