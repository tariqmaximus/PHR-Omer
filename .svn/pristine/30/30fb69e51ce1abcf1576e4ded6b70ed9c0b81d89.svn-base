import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WrapperSendEmail } from 'src/app/models/general/Wrapper-Send-Email';
import { SendFaxAttachmentsFromClient } from 'src/app/models/general/send-fax-attachments-from-client';
import { LookupList, LOOKUP_LIST } from 'src/app/providers/lookupList.module';
import { GeneralService } from 'src/app/services/general/general.service';
import { AlertTypeEnum, FaxAttachemntsTypeEnum, ServiceResponseStatusEnum } from 'src/app/shared/enum-util';
import { GeneralOperation } from 'src/app/shared/generalOperation';

@Component({
  selector: 'email-send',
  templateUrl: './email-sending.component.html',
  styleUrls: ['./email-sending.component.css']
})
export class EmailSendingComponent implements OnInit {

  isLoading=false;
  @Input() operation: string;
  @Input() callingFrom: string;
  @Input() lstAttachments: Array<any>; 



  //@Output() callbackEmail = new EventEmitter<any>();
  emailFormGroup: FormGroup;
  //@Input() email: string = '';
  //@Input() bodyHTML: string = '';

  constructor(private formBuilder: FormBuilder, @Inject(LOOKUP_LIST) public lookupList: LookupList, public activeModal: NgbActiveModal,
  private generalService: GeneralService, private modalService: NgbModal,private GeneralOperation: GeneralOperation) { }

  ngOnInit() {
    debugger;
    this.buildForm();
  }
  buildForm() {
    this.emailFormGroup = this.formBuilder.group({
      txtEmailto: this.formBuilder.control(""),
      txtEmailcc: this.formBuilder.control(""),
      txtEmailmessage: this.formBuilder.control(""),
      txtSubject: this.formBuilder.control("")
    })
  }
  onClose(){
    this.activeModal.dismiss("close");
  }
  lstMultiPart: Array<any>;
  onFileChange(event: any) {
    debugger;
    if (event.target.files != undefined && event.target.files.length > 0) {
      if (this.lstMultiPart == undefined) {
        this.lstMultiPart = new Array<any>();
      }
      let file: File = event.target.files[0];
      this.lstMultiPart.push(file);

      if (this.lstAttachments == undefined) {
        this.lstAttachments = new Array<any>();
      }

      let sendFaxAttachmentsFromClient: SendFaxAttachmentsFromClient = new SendFaxAttachmentsFromClient()

      sendFaxAttachmentsFromClient.document_name = file.name;
      sendFaxAttachmentsFromClient.document_source = FaxAttachemntsTypeEnum.MULTI_PART;
      sendFaxAttachmentsFromClient.multipart_index = this.lstMultiPart.length - 1;
      sendFaxAttachmentsFromClient.read_only = false;// true;

      this.lstAttachments.push(sendFaxAttachmentsFromClient);
    }
  }
  sendEmail(){
    if  ((this.emailFormGroup.get('txtEmailto') as FormControl).value == undefined
    || (this.emailFormGroup.get('txtEmailto') as FormControl).value == null
    || (this.emailFormGroup.get('txtEmailto') as FormControl).value == ""){
      GeneralOperation.showAlertPopUp(this.modalService, 'Send Email', "Please enter atleast single email.", AlertTypeEnum.WARNING)
      return false;
    }
    var emailsTo = (this.emailFormGroup.get('txtEmailto') as FormControl).value;
    if(emailsTo.endsWith(";") == false){
      emailsTo = emailsTo + ";";
    }
    var emailsCc = (this.emailFormGroup.get('txtEmailcc') as FormControl).value;
    if(emailsCc.endsWith(';') == false ){
      emailsCc = emailsCc + ";";
    }
    
    this.isLoading=true;
     let wrapperSendEmail: WrapperSendEmail = new WrapperSendEmail();
     wrapperSendEmail.practice_id = this.lookupList.practiceInfo.practiceId;
     wrapperSendEmail.email_address = emailsTo;
     wrapperSendEmail.email_cc_address = emailsCc;
     wrapperSendEmail.subject =(this.emailFormGroup.get('txtSubject') as FormControl).value;;
     //wrapperSendEmail.subject = "Lab Result";
     //wrapperSendEmail.message_body
     wrapperSendEmail.text_message = (this.emailFormGroup.get('txtEmailmessage') as FormControl).value;
     wrapperSendEmail.from_name = this.lookupList.logedInUser.user_name;
       //lstAttachments:Array<SendFaxAttachmentsFromClient>;

       const formData: FormData = new FormData();
       let multiPartIndex: number = 0;
       let lstSendEmailAttachmentsFromClient: Array<SendFaxAttachmentsFromClient>;
       if (this.lstAttachments != undefined && this.lstAttachments.length > 0) {
        lstSendEmailAttachmentsFromClient = new Array<SendFaxAttachmentsFromClient>();
 
         this.lstAttachments.forEach(att => {
 
           debugger;
           //if (att.checked == true) {
 
           let sendFaxAttachmentsFromClient: SendFaxAttachmentsFromClient = new SendFaxAttachmentsFromClient();
           sendFaxAttachmentsFromClient.document_id = att.document_id;
           sendFaxAttachmentsFromClient.document_name = att.document_name;
           //sendFaxAttachmentsFromClient.document_path = att.document_path;
           sendFaxAttachmentsFromClient.document_link = att.document_link;
           sendFaxAttachmentsFromClient.patient_document_id = att.patient_document_id;
           sendFaxAttachmentsFromClient.document_source = att.document_source;
           sendFaxAttachmentsFromClient.html_string = att.html_string;
 
           if (att.multipart_index != undefined) {
            if (this.lstMultiPart != undefined || this.lstMultiPart != null) {
              formData.append('attachments', this.lstMultiPart[att.multipart_index]);
              sendFaxAttachmentsFromClient.multipart_index = multiPartIndex;
              multiPartIndex++;
            }
          }
          
           lstSendEmailAttachmentsFromClient.push(sendFaxAttachmentsFromClient);
           //}
 
         });
         wrapperSendEmail.lstAttachments = lstSendEmailAttachmentsFromClient;
       }

       formData.append('wrapperSendEmail', JSON.stringify(wrapperSendEmail));
       this.generalService.sendEmailpdf(formData).subscribe(
        data => {
          this.isLoading=false;
          if (data['status'] === ServiceResponseStatusEnum.SUCCESS) {
            this.GeneralOperation.updateLog("CCDA", this.lookupList.patientInfo.patient_id, "Transmit","UnEncrypted to "+emailsTo);
                   GeneralOperation.showAlertPopUp(this.modalService, 'Send Email', "Email has been sent.", AlertTypeEnum.INFO);
                   this.onClose();          
                 }
                 if (data['status'] === ServiceResponseStatusEnum.NOT_FOUND) {
                   GeneralOperation.showAlertPopUp(this.modalService, 'Email not Sent', "Email not configured, Please contact your administrator.", AlertTypeEnum.WARNING);
                  return;
                 }
        },
        error => {
          GeneralOperation.showAlertPopUp(this.modalService, 'Error in Email Sent', "An Error Occured While Saving.", AlertTypeEnum.DANGER);
          return;
        }
      );

  }
}
