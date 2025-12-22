import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LookupList, LOOKUP_LIST } from 'src/app/providers/lookupList.module';
import { DateTimeUtil } from 'src/app/shared/date-time-util';
import { GeneralOperation } from 'src/app/shared/generalOperation';
import { AlertTypeEnum, ServiceResponseStatusEnum } from 'src/app/shared/enum-util';
import { SearchCriteria } from 'src/app/models/common/search-criteria';
import { Md5 } from 'ts-md5';
import { PhrService } from 'src/app/services/phr/phr.service';
import { ChangePasswordModel } from 'src/app/models/change-password-model';

@Component({
  selector: 'password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {
  inputForm: FormGroup;

  constructor(public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    @Inject(LOOKUP_LIST) public lookupList: LookupList,
    private dateTimeUtil: DateTimeUtil,
    private modalService: NgbModal,
    private phrService: PhrService,
    private generalOperation: GeneralOperation) { }

  ngOnInit() {
    this.buildForm();
  }
  buildForm() {
    this.inputForm = this.formBuilder.group({
      currentPassword: this.formBuilder.control(null),
      newPassword: this.formBuilder.control(null, Validators.required),
      confirmPassword: this.formBuilder.control(null, Validators.required),
    })
  }
  onSubmit(frm) {
    debugger;
    // if(Md5.hashStr(frm.currentPassword)!=this.lookupList.logedInUser.password)
    // {
    //   GeneralOperation.showAlertPopUp(this.modalService,"Reset Password","Current password is not correct.","warning")
    //   return;
    // }
    if (frm.currentPassword == undefined || frm.currentPassword == '') {
      GeneralOperation.showAlertPopUp(this.modalService, "Change Password", "Please enter current password.", "warning")
      return;
    }
    if (frm.newPassword == undefined || frm.newPassword == '') {
      GeneralOperation.showAlertPopUp(this.modalService, "Change Password", "Please enter new password.", "warning")
      return;
    }
    if (frm.newPassword != frm.confirmPassword) {
      GeneralOperation.showAlertPopUp(this.modalService, "Change Password", "New and Confirm password should be same.", "warning")
      return;
    }

    let changePasswordModel: ChangePasswordModel = new ChangePasswordModel();
    changePasswordModel.NewPassword = btoa(frm.newPassword);
    changePasswordModel.OldPassword = btoa(frm.currentPassword);
    changePasswordModel.UserId = this.lookupList.logedInUser.userId;

    this.phrService.changePassword(changePasswordModel).subscribe(
      {
        next: (value: any) => {
          debugger;
          if (value.status === ServiceResponseStatusEnum.SUCCESS) {
            GeneralOperation.showAlertPopUp(this.modalService, "Change Password", "Password Changed Successfully.", AlertTypeEnum.SUCCESS)
            this.activeModal.dismiss('Cross click');
          }
          else if (value.status === ServiceResponseStatusEnum.ERROR) {
            GeneralOperation.showAlertPopUp(this.modalService, "Change Password", value.response, AlertTypeEnum.DANGER)
            //this.activeModal.dismiss('Cross click');
          }
        },
        error: (e: any) => {
        }
      });

  }

}