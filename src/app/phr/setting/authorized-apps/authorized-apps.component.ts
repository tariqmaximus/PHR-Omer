import { Component, Inject, OnInit } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AlertPopupComponent } from 'src/app/general-modules/alert-popup/alert-popup.component';
import { ConfirmationPopupComponent } from 'src/app/general-modules/confirmation-popup/confirmation-popup.component';
import { Param } from 'src/app/models/param';
import { UpdateRecordModel } from 'src/app/models/update-record-model';
import { LOOKUP_LIST, LookupList } from 'src/app/providers/lookupList.module';
import { PhrService } from 'src/app/services/phr/phr.service';
import { DateTimeFormat, DateTimeUtil } from 'src/app/shared/date-time-util';
import { PromptResponseEnum, ServiceResponseStatusEnum } from 'src/app/shared/enum-util';
import { GeneralOperation } from 'src/app/shared/generalOperation';
import { LogMessage } from 'src/app/shared/log-message';
import { UniquePipe } from 'src/app/shared/unique-pipe';

@Component({
  selector: 'authorized-apps',
  templateUrl: './authorized-apps.component.html',
  styleUrls: ['./authorized-apps.component.css']
})
export class AuthorizedAppsComponent implements OnInit {

  lstAuthorizedApps: Array<any>;
  lstAuthorizedAppsUsers: Array<any>;
  isLoading: boolean = false;

  popUpOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false
  };

  constructor(@Inject(LOOKUP_LIST) public lookupList: LookupList
    , private phrService: PhrService,
    private logMessage: LogMessage,
    private ngbModel: NgbModal,
    private dateTimeUtil: DateTimeUtil) { }

  ngOnInit() {
    this.GetPatientAuthorizedClientsUserDetail();
  }

  GetPatientAuthorizedClientsUserDetail() {
    this.isLoading = true;
    this.phrService.GetPatientAuthorizedClientsUserDetail(this.lookupList.patientInfo.patient_id)
      .subscribe(
        (data: any) => {
          this.lstAuthorizedAppsUsers = data;
          this.lstAuthorizedApps = (new UniquePipe).transform(this.lstAuthorizedAppsUsers, "clientId");
          this.isLoading = false;
        },
        error => {
          this.logMessage.log("An Error Occured while GetPatientAuthorizedClients list.")
          this.isLoading = false;
        }
      );
  }

  onRevokeAccess(objApp: any) {
    const modalRef = this.ngbModel.open(ConfirmationPopupComponent, this.popUpOptions);
    modalRef.componentInstance.alertType = 'warning';
    modalRef.componentInstance.promptHeading = 'Cofirm Revoke !';
    modalRef.componentInstance.promptMessage = 'Are you sure you want to revoke application access?';

    let closeResult;
    modalRef.result.then((result) => {

      if (result == PromptResponseEnum.YES) {
        let updateRecordModel: UpdateRecordModel = new UpdateRecordModel();
        updateRecordModel.client_datetime = this.dateTimeUtil.getCurrentDateTimeStringWithFormat(DateTimeFormat.DATEFORMAT_YYYY_MM_DD_HH_mm_ss_SSS);
        updateRecordModel.client_ip = this.lookupList.logedInUser.systemIp;

        let lstParam: Array<Param> = new Array();
        lstParam.push(new Param("client_id", objApp.clientId, ""))
        lstParam.push(new Param("patient_id", this.lookupList.patientInfo.patient_id, ""))
        updateRecordModel.param_list = lstParam;

        this.phrService.RevokePatientAuthorizedClientAccess(updateRecordModel).subscribe(
          (data: any) => {
            if (data.status === ServiceResponseStatusEnum.SUCCESS) {
              const modalRef = this.ngbModel.open(AlertPopupComponent, this.popUpOptions);
              modalRef.componentInstance.promptHeading = "Application Access"
              modalRef.componentInstance.promptMessage = "Application Access has been reovked successfully.";
              this.GetPatientAuthorizedClientsUserDetail();
            }
            else {
              GeneralOperation.showAlertPopUp(this.ngbModel, "Application Access", data.response, 'danger')
            }
          },
          (error: any) => {
            GeneralOperation.showAlertPopUp(this.ngbModel, "Application Access", "An Error Occured while revoking access.", 'danger')
          }
        );
      }
    }, (reason) => {
      //alert(reason);
    });
  }
}
