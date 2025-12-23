import { Component, OnInit, Output, EventEmitter, Input, Inject } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, FormControl } from '@angular/forms';
import { LookupList, LOOKUP_LIST } from 'src/app/providers/lookupList.module';
import { PhrService } from 'src/app/services/phr/phr.service';
import { LogMessage } from 'src/app/shared/log-message';
import Quill from 'quill';
import { ORMPatientMessages } from 'src/app/models/messages/ORMPatientMessages';
import { ORMAmemdmentRequest } from 'src/app/models/messages/ORMAmemdmentRequest';
import { DateTimeUtil } from 'src/app/shared/date-time-util';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { GeneralOperation } from 'src/app/shared/generalOperation';
import { ConfirmationPopupComponent } from 'src/app/general-modules/confirmation-popup/confirmation-popup.component';
import { PromptResponseEnum } from 'src/app/shared/enum-util';
import { ORMPatientMessageAttachment } from 'src/app/models/messages/ORMPatientMessageAttachment';
import { WrapperPatientMessage } from '../../../models/messages/WrapperPatientMessage';
import { ComposeMessageParams } from 'src/app/models/messages/compse-messge-params';
import { GeneralService } from 'src/app/services/general/general.service';



@Component({
  selector: 'phr-message-compose',
  templateUrl: './phr-message-compose.component.html',
  styleUrls: ['./phr-message-compose.component.css']
})
export class PhrMessageComposeComponent implements OnInit {
  @Output() onCloseNewMessage = new EventEmitter<any>();
  @Input() cmposeMessageParams: ComposeMessageParams;

  phrMsgComposeForm: FormGroup;
  public txtMessageEditTo: AbstractControl;
  quilComposeMessageEdit: FormGroup;

  //arrDetailsMessages: Array<any>;
  lstMessageAttachments: Array<any>;
  //arrLinks: Array<any>;
  //listInfoCaptureLinks: Array<any>;
  patMsgLinksList: Array<any>;
  lstAttachmentsAdded: Array<any>;
  //arrLinksAttachments: Array<any>;
  //ormListAttachments: ORMMessageAttachment = new ORMMessageAttachment();
  //listAttachments: Array<any>;
  lstMultiPart: Array<File>;//add files
  is_attachment: boolean = false;
  //arrMsgSendAttachments;
  selectedProviderName: string = "";


  //objMessage: ORMPatientMessages = new ORMPatientMessages();
  //ormObjAmd: ORMAmemdmentRequest = new ORMAmemdmentRequest();
  // objMessageDetail: ORMPatientMessageDetail = new ORMPatientMessageDetail();
  //objMsgAttach: ORMMessageAttachment = new ORMMessageAttachment();
  //isMessageType = "";

  patientId: number = 0;
  isLoading = false;
  messageThreadId: number = 0;
  patientName: string = '';

  constructor(@Inject(LOOKUP_LIST) public lookupList: LookupList,
    private phrService: PhrService,
    private logMessage: LogMessage,
    private modalService: NgbModal,
    private generalService: GeneralService,
    private dateTimeUtil: DateTimeUtil,
    private formBuilder: FormBuilder) {

    this.patientId = this.lookupList.patientInfo.patient_id;
    this.patientName = this.lookupList.patientInfo.last_name + ", " + this.lookupList.patientInfo.first_name;
    this.quilComposeMessageEdit = formBuilder.group({
      'txtMessageEditTo': [''],
    });
    this.txtMessageEditTo = this.quilComposeMessageEdit.controls['txtMessageEditTo'];
  }

  ngOnInit() {

    this.buildForm();

    if (this.cmposeMessageParams.message_type == 'reply') {
      this.assignReplyValues();
    }
    else {
      if (this.lookupList.providerList == undefined || this.lookupList.providerList.length == 0) {
        this.getProviderList();
      }
    }

    debugger;


    debugger;
    // if (this.objReply[0].msgType.length > 0) {
    //   if (this.objReply[0].msgType[0].action_type) {
    //     this.isMessageType = this.objReply[0].msgType[0].action_type;
    //     this.assignValues();
    //   }
    // } else {      
    //   this.patientName = this.lookupList.patientInfo.last_name + ", " + this.lookupList.patientInfo.first_name
    // }
  }
  assignReplyValues() {

    this.selectedProviderName = this.cmposeMessageParams.providerName;
    (this.phrMsgComposeForm.get("txt_subject") as FormControl).setValue("Re: " + this.cmposeMessageParams.subject);
    (this.phrMsgComposeForm.get("amendment_Flag") as FormControl).setValue(this.cmposeMessageParams.is_amendments);


    var strBody: String = "<p><br/></p><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"></P></TEXTFORMAT>" +
      "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"></P></TEXTFORMAT>" +
      "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Verdana\" SIZE=\"10\" COLOR=\"#e6e6e6\" LETTERSPACING=\"0\" KERNING=\"0\">_____________________________________________________________</FONT></P></TEXTFORMAT>";


    strBody = strBody + "<TEXTFORMAT LEADING='2'><P ALIGN='LEFT'></P></TEXTFORMAT>" +
      "<TEXTFORMAT LEADING='2'><P ALIGN='LEFT'><FONT FACE='Verdana' SIZE='11' LETTERSPACING='0' KERNING='0'><B>From: </B>" + this.cmposeMessageParams.providerName + "</FONT></P></TEXTFORMAT>" +
      "<TEXTFORMAT LEADING='2'><P ALIGN='LEFT'><FONT FACE='Verdana' SIZE='11' LETTERSPACING='0' KERNING='0'><B>Date: </B> " + this.cmposeMessageParams.messageDate + "</FONT></P></TEXTFORMAT>" +
      "<TEXTFORMAT LEADING='2'><P ALIGN='LEFT'><FONT FACE='Verdana' SIZE='11' LETTERSPACING='0' KERNING='0'><B>Subject:</B> " + this.cmposeMessageParams.subject + "</FONT></P></TEXTFORMAT>" +
      "<TEXTFORMAT LEADING='2'><P ALIGN='LEFT'><FONT FACE='Verdana' SIZE='10' LETTERSPACING='0' KERNING='0'></FONT></P></TEXTFORMAT><p><br/></p>";


    strBody = strBody + this.cmposeMessageParams.messageBodyHtml;

    this.quilComposeMessageEdit = this.formBuilder.group({
      'txtMessageEditTo': [strBody],
    });
    this.txtMessageEditTo = this.quilComposeMessageEdit.controls['txtMessageEditTo'];


    // this.quilComposeMessageEdit = this.formBuilder.group({
    //   'txtMessageEditTo': [this.cmposeMessageParams.messageBodyText],
    // });
    // this.txtMessageEditTo = this.quilComposeMessageEdit.controls['txtMessageEditTo'];

    // debugger;
    //(this.phrMsgComposeForm.get("txtMsgFrom") as FormControl).setValue(this.objReply[0].msgFrom[0].name);
    //(this.phrMsgComposeForm.get("txt_subject") as FormControl).setValue(this.objReply[0].msgSubject[0].msg_subj);
    //(this.phrMsgComposeForm.get("cmbProvider") as FormControl).setValue(this.objReply[0].selectedProvider[0].msg_selected_provider);
    //(this.phrMsgComposeForm.get("amendment_Flag") as FormControl).setValue(this.objReply[0].msgFrom[0].msg_Amendment);


    //this.quilComposeMessageEdit = this.formBuilder.group({
    //      'txtMessageEditTo': [this.objReply[0].msgText[0].msg_text],
    //  });
    //this.txtMessageEditTo = this.quilComposeMessageEdit.controls['txtMessageEditTo'];

    // if (this.lstAttachmentsAdded == undefined) {
    //   this.lstAttachmentsAdded = new Array<any>();
    // }
    // this.lstAttachmentsAdded = this.objReply[0].attachments[0].msg_Attachments;
    // if (this.lstAttachmentsAdded != null) {
    //   this.is_attachment = true;
    // }
  }
  getProviderList() {
    this.generalService.getProvider(this.lookupList.practiceInfo.practiceId).subscribe(
      data => {
        this.lookupList.providerList = data as Array<any>;
      },
      error => {
        this.getProviderListError(error);
      }
    );
  }
  getProviderListError(error) {
    this.logMessage.log("getProviderList Error." + error);
  }
  buildForm() {
    this.phrMsgComposeForm = this.formBuilder.group({
      cmbProvider: this.formBuilder.control(null),
      //txtMsgFrom: this.formBuilder.control(""),
      amendment_Flag: this.formBuilder.control(""),
      txt_subject: this.formBuilder.control(""),
      //txtaddLinks: this.formBuilder.control(null)
      //prior_Flag: this.formBuilder.control("")
    })
  }
  onFileChange(event) {

    debugger;
    if (event.target.files != undefined && event.target.files.length > 0) {

      let ormListAttachments = new ORMPatientMessageAttachment();
      if (this.lstAttachmentsAdded == undefined) {
        this.lstAttachmentsAdded = new Array<ORMPatientMessageAttachment>();
      }

      ormListAttachments.message_attachment_id = 0;
      ormListAttachments.patient_id = this.patientId;
      ormListAttachments.practice_id = this.lookupList.practiceInfo.practiceId;
      ormListAttachments.document_date = "";
      ormListAttachments.name = event.target.files[0].name;

      ormListAttachments.original_file_name = event.target.files[0].name;
      ormListAttachments.link = "";
      ormListAttachments.message_id = 0;
      ormListAttachments.attach_type = "file";

      this.lstAttachmentsAdded.push(ormListAttachments);
      // this.listAttachments.push(this.arrAttachments[0]);

      let file: File = event.target.files[0];
      if (this.lstMultiPart == undefined) {
        this.lstMultiPart = new Array<File>();
      }
      this.lstMultiPart.push(file);
      this.is_attachment = true;


      // debugger;
      // this.ormListAttachments = new ORMMessageAttachment();
      // if (this.arrAttachments == undefined) {
      //   this.arrAttachments = new Array<any>();
      // }

      // this.ormListAttachments.message_attachment_id = 0;
      // this.ormListAttachments.patient_id = this.lookupList.patientInfo.patient_id;
      // this.ormListAttachments.practice_id = this.lookupList.practiceInfo.practiceId;
      // this.ormListAttachments.document_date = "";
      // this.ormListAttachments.name = event.target.files[0].name;
      // this.ormListAttachments.original_file_name = event.target.files[0].name;
      // this.ormListAttachments.link = "";
      // this.ormListAttachments.message_id = "";
      // this.ormListAttachments.attach_type = "file";

      // this.arrAttachments.push(this.ormListAttachments);
      // // this.listAttachments.push(this.arrAttachments[0]);
      // if (this.arrMultiFiles == undefined) {
      //   this.arrMultiFiles = new Array<any>();
      // }
      // this.arrMultiFiles.push(event.target.files[0]);
      // this.is_attachment = true;

    }
  }
  // validateLink() {
  //   if ((this.phrMsgComposeForm.get('txtaddLinks') as FormControl).value.trim() == "") {
  //     alert("Pleas enter link.");
  //     return false;
  //   }
  //   return true;
  // }
  // addLink() {
  //   if (this.validateLink()) {
  //     this.ormListAttachments = new ORMMessageAttachment();
  //     if (this.arrLinks == undefined) {
  //       this.arrLinks = new Array<any>();
  //     }
  //     // if (this.listInfoCaptureLinks == undefined) {
  //     //   this.listInfoCaptureLinks = new Array<any>();
  //     // }

  //     this.ormListAttachments.message_attachment_id = 0;
  //     this.ormListAttachments.name = (this.phrMsgComposeForm.get('txtaddLinks') as FormControl).value;
  //     this.ormListAttachments.original_file_name = "";
  //     this.ormListAttachments.link = (this.phrMsgComposeForm.get('txtaddLinks') as FormControl).value;
  //     this.ormListAttachments.message_id = "";
  //     this.ormListAttachments.attach_type = "link";

  //     this.arrLinks.push(this.ormListAttachments);
  //     //this.listInfoCaptureLinks.push(this.arrLinks[0]);
  //   }
  // }

  sendPatientMessage() {
    debugger;
    if (this.Validation()) {

      debugger;
      let objMessage: ORMPatientMessages = new ORMPatientMessages();
      objMessage.message_subject = (this.phrMsgComposeForm.get('txt_subject') as FormControl).value;
      var quill = new Quill('#messageRichEditorToEdit', {
        theme: 'snow'
      });
      objMessage.message_body_html = this.quilComposeMessageEdit.controls.txtMessageEditTo.value;//quill.getText().trim(); //this.patientMsgComposeForm.controls.txtMessageEditTo.value
      objMessage.message_body_text = quill.getText().trim();

      objMessage.sender_id = this.lookupList.logedInUser.userId;
      objMessage.sender_source = "PHR";

      objMessage.message_date = this.dateTimeUtil.getCurrentDateTimeString();

      objMessage.patient_id = this.patientId;

      if (this.cmposeMessageParams.message_type == 'new') {
        objMessage.provider_id = (this.phrMsgComposeForm.get('cmbProvider') as FormControl).value;
      }
      else if (this.cmposeMessageParams.message_type == 'reply') {
        objMessage.provider_id = this.cmposeMessageParams.providerId;
      }

      objMessage.client_date_created = this.dateTimeUtil.getCurrentDateTimeString();
      objMessage.client_date_modified = this.dateTimeUtil.getCurrentDateTimeString();
      objMessage.created_user = this.lookupList.logedInUser.user_name;

      objMessage.is_amendments = this.phrMsgComposeForm.get("amendment_Flag").value == true ? true : false;
      objMessage.is_draft = false;
      objMessage.is_read = false;
      objMessage.system_ip = this.lookupList.logedInUser.systemIp;
      objMessage.modified_user = this.lookupList.logedInUser.user_name;
      objMessage.practice_id = this.lookupList.practiceInfo.practiceId;

      objMessage.is_sender_archived = false;
      objMessage.is_receiver_archived = false;

      objMessage.message_thread_id = this.messageThreadId;


      //   //AMENDMENT check
      let ormObjAmd: ORMAmemdmentRequest;
      if (this.phrMsgComposeForm.get("amendment_Flag").value == true) {
        ormObjAmd = new ORMAmemdmentRequest();
        ormObjAmd.patient_id = this.patientId;
        var quill = new Quill('#messageRichEditorToEdit', {
          theme: 'snow'
        });

        ormObjAmd.request_details = quill.getText().trim();
        ormObjAmd.request_status = "Pending";
        ormObjAmd.practice_id = this.lookupList.practiceInfo.practiceId;
        ormObjAmd.request_date = this.dateTimeUtil.getCurrentDateTimeString();
        if (this.lookupList.is_AuthUser)
          ormObjAmd.created_user = this.lookupList.logedInUser.user_name + " (Authorized User)";
        else
          ormObjAmd.created_user = this.lookupList.logedInUser.user_name;
        ormObjAmd.client_date_created = this.dateTimeUtil.getCurrentDateTimeString();
        ormObjAmd.client_date_modified = this.dateTimeUtil.getCurrentDateTimeString();
      }
      else {
        ormObjAmd = null;
      }


      let WrapperPatient: WrapperPatientMessage = new WrapperPatientMessage();
      WrapperPatient.patient_message = objMessage;
      //WrapperPatient.objPatMsgDetail = this.arrDetailsMessages;
      WrapperPatient.amendment_request = ormObjAmd;
      WrapperPatient.lst_attachments = this.lstAttachmentsAdded;// this.objMsgAttachment;

      const formData: FormData = new FormData();

      if (this.lstAttachmentsAdded != undefined && this.lstAttachmentsAdded.length > 0) {
        for (let index = 0; index < this.lstAttachmentsAdded.length; index++) {
          formData.append('attachments', this.lstMultiPart[index]);
        }
      }
      else {
        formData.append('attachments', null);
      }

      formData.append('data', JSON.stringify(WrapperPatient));

      this.phrService.SavePatientMessage(formData)
        .subscribe(
          (data: any) => {
            this.discardMessage();
            //this.clearAll();
            //this.discardPatMsgT();
            //this.onOptionChange("inbox");
          },
          (error: any) => {
            alert(error)
          },

          () => this.logMessage.log("Save Patient Message.")
        );
    }
  }

  // sendPhrEmail(event: any) {
  //   debugger;
  //   if (event.key === "Enter") {
  //     return;
  //   }
  //   if (!this.Validation())
  //     return;

  //   //this.arrDetailsMessages = new Array<any>();
  //   this.isLoading = true;

  //   var strToUser: String = "";
  //   var strCcUser: String = "";

  //   this.objMessage = new ORMPatientMessages();


  //   objMessage.message_subject = (this.phrMsgComposeForm.get('txt_subject') as FormControl).value;
  //   var quill = new Quill('#messageRichEditorToEdit', {
  //     theme: 'snow'
  //   });
  //   objMessage.message_body_html = this.quilComposeMessageEdit.controls.txtMessageEditTo.value;//quill.getText().trim(); //this.patientMsgComposeForm.controls.txtMessageEditTo.value
  //   objMessage.message_body_text = quill.getText().trim();
  //   objMessage.sender_id = this.lookupList.logedInUser.userId;
  //   objMessage.sender_source = "PHR";

  //   objMessage.message_date = this.dateTimeUtil.getCurrentDateTimeString();

  //   objMessage.patient_id = this.patientId;
  //   objMessage.provider_id = (this.phrMsgComposeForm.get('cmbProvider') as FormControl).value;

  //   objMessage.deleted = false;
  //   objMessage.client_date_created = this.dateTimeUtil.getCurrentDateTimeString();
  //   objMessage.client_date_modified = this.dateTimeUtil.getCurrentDateTimeString();
  //   objMessage.created_user = this.lookupList.logedInUser.user_name;

  //   objMessage.is_draft = false;
  //   objMessage.is_read = false;
  //   objMessage.system_ip = this.lookupList.logedInUser.systemIp;
  //   objMessage.modified_user = this.lookupList.logedInUser.user_name;
  //   objMessage.practice_id = this.lookupList.practiceInfo.practiceId;
  //   objMessage.is_amendment = false;

  //   objMessage.is_sender_archived = false;
  //   objMessage.is_receiver_archived = false;
  //   objMessage.message_thread_id = this.messageThreadId;


  //   // objMessage.mess_subject = (this.phrMsgComposeForm.get('txt_subject') as FormControl).value

  //   // var quill = new Quill('#messageRichEditorToEdit', {
  //   //   theme: 'snow'
  //   // });

  //   // objMessage.mess_body_html = this.quilComposeMessageEdit.controls.txtMessageEditTo.value;//quill.getText().trim(); //this.patientMsgComposeForm.controls.txtMessageEditTo.value
  //   // objMessage.mess_body_text = quill.getText().trim();

  //   // objMessage.mess_to = this.selectedProviderName;
  //   // objMessage.deleted = false;
  //   // objMessage.message_type = "PHR";
  //   // objMessage.from_id = this.patientId;
  //   // objMessage.to_id = (this.phrMsgComposeForm.get('cmbProvider') as FormControl).value;

  //   // objMessage.sender_id = this.lookupList.logedInUser.userId.toString(); //null;// null or 0 in case of PHR

  //   // objMessage.is_amendments = this.phrMsgComposeForm.get("amendment_Flag").value == true ? true : false;
  //   // objMessage.client_date_created = this.dateTimeUtil.getCurrentDateTimeString();
  //   // objMessage.client_date_modified = this.dateTimeUtil.getCurrentDateTimeString();
  //   // //objMessage.client_date_created = "2019-05-31 17:11:01.000";
  //   // //objMessage.client_date_modified = "2019-05-31 17:11:01.000";
  //   // objMessage.created_user = this.lookupList.logedInUser.user_name;
  //   // objMessage.message_id = "";
  //   // objMessage.is_draft = false;
  //   // objMessage.modified_user = this.lookupList.logedInUser.user_name;
  //   // objMessage.practice_id = this.lookupList.practiceInfo.practiceId.toString();

  //   // this.objMessageDetail = new ORMPatientMessageDetail();
  //   // this.objMessageDetail.recieve_date = this.dateTimeUtil.getCurrentDateTimeString();
  //   // this.objMessageDetail.readed = false;
  //   // this.objMessageDetail.mail_status = "inbox";
  //   // this.objMessageDetail.patient_id = this.patientId;
  //   // this.objMessageDetail.deleted = false;


  //   // this.objMessageDetail.user_id = this.lookupList.logedInUser.userId.toString();
  //   // this.objMessageDetail.modified_user = this.lookupList.logedInUser.user_name;
  //   // this.objMessageDetail.client_date_created = this.dateTimeUtil.getCurrentDateTimeString();
  //   // this.objMessageDetail.client_date_modified = this.dateTimeUtil.getCurrentDateTimeString();
  //   // this.objMessageDetail.phr_user = this.lookupList.logedInUser.user_name;
  //   // this.objMessageDetail.created_user = this.lookupList.logedInUser.user_name;

  //   //this.arrDetailsMessages.push(this.objMessageDetail);
  //   //this.messageComposeForm.get("prior_Flag").value == true ? true : false;
  //   //AMENDMENT check
  //   if (this.phrMsgComposeForm.get("amendment_Flag").value == true) {
  //     this.ormObjAmd = new ORMAmemdmentRequest();
  //     this.ormObjAmd.patient_id = this.patientId;
  //     var quill = new Quill('#messageRichEditorToEdit', {
  //       theme: 'snow'
  //     });

  //     this.ormObjAmd.request_details = quill.getText().trim();
  //     this.ormObjAmd.request_status = "Pending";
  //     this.ormObjAmd.practice_id = this.lookupList.practiceInfo.practiceId;
  //     this.ormObjAmd.request_date = this.dateTimeUtil.getCurrentDateTimeString();
  //     if (this.lookupList.is_AuthUser)
  //       this.ormObjAmd.created_user = this.lookupList.logedInUser.user_name + " (Authorized User)";
  //     else
  //       this.ormObjAmd.created_user = this.lookupList.logedInUser.user_name;

  //     // if(GeneralOptions.is_AuthUser)
  //     //   ormObjAmd.modified_user= GeneralOptions.loginUser+" (Authorized User)";
  //     //  else
  //     //    ormObjAmd.modified_user= GeneralOptions.loginUser;
  //     this.ormObjAmd.client_date_created = this.dateTimeUtil.getCurrentDateTimeString();
  //     this.ormObjAmd.client_date_modified = this.dateTimeUtil.getCurrentDateTimeString();
  //   }
  //   else {
  //     this.ormObjAmd = null;
  //   }
  //   //attach file
  //   if (this.is_attachment) {
  //     if (this.arrAttachments != null) {
  //       if (this.arrMsgSendAttachments == undefined) {
  //         this.arrMsgSendAttachments = new Array();
  //       }
  //       for (var i = 0; i < this.arrAttachments.length; i++) {
  //         this.objMsgAttach = new ORMMessageAttachment();
  //         // if (this.arrAttachments[i].fileBytes == null || this.arrAttachments[i].fileBytes == "") {
  //         //   alert("Problem in " + this.arrAttachments[i].name + ", please re-attach the Attachment.");
  //         //   return;
  //         // }

  //         if (this.arrAttachments[i].message_id != "") {
  //           this.objMsgAttach.message_attachment_id = this.arrAttachments[i].message_id;
  //           this.objMsgAttach.patient_id = this.patientId;
  //           this.objMsgAttach.practice_id = this.lookupList.practiceInfo.practiceId;
  //           this.objMsgAttach.document_date = "";//GeneralOptions.CurrentDateTimeString();
  //           this.objMsgAttach.original_file_name = this.arrAttachments[i].original_file_name; //browseFile.name;
  //           this.objMsgAttach.name = this.arrAttachments[i].original_file_name; //fine name.
  //           this.objMsgAttach.link = this.arrAttachments[i].link
  //           this.objMsgAttach.attach_type = "file";
  //           this.arrMsgSendAttachments.push(this.objMsgAttach);
  //         } else {
  //           this.objMsgAttach.message_attachment_id = 0;
  //           this.objMsgAttach.patient_id = this.patientId;
  //           this.objMsgAttach.practice_id = this.lookupList.practiceInfo.practiceId;
  //           this.objMsgAttach.document_date = "";//GeneralOptions.CurrentDateTimeString();
  //           this.objMsgAttach.original_file_name = this.arrAttachments[i].name; //browseFile.name;
  //           this.objMsgAttach.name = this.arrAttachments[i].name;
  //           this.objMsgAttach.link = "";
  //           this.objMsgAttach.attach_type = "file";
  //           this.arrMsgSendAttachments.push(this.objMsgAttach);
  //         }

  //         // this.objMsgAttach.message_attachment_id = "";
  //         // this.objMsgAttach.patient_id = this.lookupList.logedInUser.patientID.toString();
  //         // this.objMsgAttach.practice_id = this.lookupList.practiceInfo.practiceId.toString();
  //         // this.objMsgAttach.document_date = "";//GeneralOptions.CurrentDateTimeString();
  //         // this.objMsgAttach.original_file_name = this.arrAttachments[i].name; //browseFile.name;
  //         // this.objMsgAttach.name = this.arrAttachments[i].name;
  //         // this.objMsgAttach.link = "";
  //         // this.objMsgAttach.attach_type = "file";
  //         // this.arrMsgSendAttachments.push(this.objMsgAttach);
  //       }
  //     }

  //   }

  //   //attach end
  //   //links
  //   //if (this.arrLinks != null || this.arrLinks != undefined) {
  //   // if (this.arrLinks) {
  //   //   //check this detail
  //   //   if (this.arrMsgSendAttachments == null || this.arrMsgSendAttachments == undefined) {
  //   //     this.arrMsgSendAttachments = new Array();
  //   //   }
  //   //   for (var z = 0; z < this.arrLinks.length; z++) {
  //   //     this.objMsgAttach = new ORMMessageAttachmentsendfromPhr();
  //   //     if (this.arrLinks[z].message_attachment_id == "") {
  //   //       this.objMsgAttach.message_attachment_id = "";
  //   //       this.objMsgAttach.patient_id = this.patientId;
  //   //       this.objMsgAttach.practice_id = this.lookupList.practiceInfo.practiceId.toString();
  //   //       this.objMsgAttach.document_date = "";
  //   //       this.objMsgAttach.name = this.arrLinks[z].name;
  //   //       this.objMsgAttach.original_file_name = this.arrLinks[z].name;
  //   //       this.objMsgAttach.link = this.arrLinks[z].name;
  //   //       this.objMsgAttach.message_id = "";
  //   //       this.objMsgAttach.attach_type = "link";
  //   //       this.arrMsgSendAttachments.push(this.objMsgAttach);
  //   //     }
  //   //   }
  //   // }//link end

  //   var acAttachmentPath = this.generalOperation.filterArray(this.lookupList.lstdocumentPath, "category_name", "Messages");
  //   //if (this.arrMsgSendAttachments == null) {
  //   // if (!this.arrMsgSendAttachments) {
  //   //   this.arrMsgSendAttachments = new Array<any>();
  //   // }

  //   //if (this.arrDetailsMessages == null) {
  //   // if (!this.arrDetailsMessages) {
  //   //   this.arrDetailsMessages = new Array<any>();
  //   // }
  //   //if (this.arrLinks == null) {
  //   // if (!this.arrLinks) {
  //   //   this.arrLinks = new Array<any>();
  //   // }
  //   //if (this.ormObjAmd == null) {
  //   // if (!this.ormObjAmd) {
  //   //   this.ormObjAmd = new ORMAmemdmentRequest();
  //   // }
  //   //roMessages.SavePatientMessages.send("Messages", arrLinks);
  //   let WrapperPHRmsg: WrapperPhrMsg = new WrapperPhrMsg();
  //   WrapperPHRmsg.objPatientMessages = this.objMessage;
  //   //WrapperPHRmsg.objPatientMessageDetails = this.arrDetailsMessages;
  //   WrapperPHRmsg.objAmemdmentReq = this.ormObjAmd;
  //   WrapperPHRmsg.objMessageAttachmentPhr = this.arrMsgSendAttachments;
  //   if (acAttachmentPath) {
  //     if (acAttachmentPath.length > 0)
  //       WrapperPHRmsg.path = acAttachmentPath[0].upload_path;
  //     else
  //       WrapperPHRmsg.path = "";
  //   } else
  //     WrapperPHRmsg.path = "";


  //   const formData: FormData = new FormData();
  //   if (this.arrMultiFiles != undefined || this.arrMultiFiles != null) {
  //     for (let a = 0; a < this.arrMultiFiles.length; a++) {
  //       formData.append('attachFile', this.arrMultiFiles[a]);
  //     }
  //   } else {
  //     formData.append('attachFile', null);
  //   }
  //   formData.append('patMsgWrapperData', JSON.stringify(WrapperPHRmsg));



  //   this.phrService.savePatiehtPhrMsg(formData).subscribe(
  //     data => {
  //       this.discardMessage();
  //     },
  //     error => {
  //       this.isLoading = false;
  //       return;
  //     }
  //   );

  // }
  Validation() {
    if ((this.phrMsgComposeForm.get('cmbProvider') as FormControl).value == "") {
      alert("Please select valid provider.");
      return false;
    }
    if ((this.phrMsgComposeForm.get('txt_subject') as FormControl).value.trim() == "") {
      alert("Please enter message subject.");
      return false;
    }

    debugger;
    var quill = new Quill('#messageRichEditorToEdit', {
      theme: 'snow'
    });
    if (quill.getText().trim() == "") {
      alert("Please enter message detail.");
      return false;
    }
    return true;
  }
  discardMessage() {
    this.isLoading = false;
    this.onCloseNewMessage.emit();
  }
  poupUpOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false
  };
  // deleteSelectedRecord(value, index) {
  //   const modalRef = this.modalService.open(ConfirmationPopupComponent, this.poupUpOptions);
  //   modalRef.componentInstance.promptHeading = 'Confirm Removal !';
  //   modalRef.componentInstance.promptMessage = 'Are you sure you want to remove selected record?';
  //   let closeResult;
  //   modalRef.result.then((result) => {
  //     if (result == PromptResponseEnum.YES) {
  //       if (value.message_attachment_id == "") {
  //         this.arrLinks.splice(index, 1);
  //       }
  //     }
  //   }, (reason) => {
  //     //alert(reason);
  //   });

  // }
  checkEnter(event) {
    if (event.key === "Enter") {
      return false;
    }
  }
  //   deleteSelectedAttach(value, index){
  //   // if(value.message_id !=""){
  //   //   const modalRef = this.modalService.open(ConfirmationPopupComponent, this.poupUpOptions);
  //   //       modalRef.componentInstance.promptHeading = 'Confirm Removal !';
  //   //       modalRef.componentInstance.promptMessage = 'Are you sure you want to delete selected attachment?';
  //   //       let closeResult;
  //   //       modalRef.result.then((result) => {
  //   //         if (result == PromptResponseEnum.YES) {
  //   //           let deleteRecordData = new ORMDeleteRecord();
  //   //           deleteRecordData.column_id = value.message_id.toString();
  //   //           deleteRecordData.modified_user = this.lookupList.logedInUser.user_name;
  //   //           deleteRecordData.client_date_time = "2019-05-31 17:11:01.000";//this.dateTimeUtil.getCurrentDateTimeString();
  //   //           deleteRecordData.client_ip = this.lookupList.logedInUser.systemIp;

  //   //           this.phrService.deleteSelectedAttachment(deleteRecordData)
  //   //             .subscribe(
  //   //               data => this.ondeleteAttachSuccessfully(data, index),
  //   //               error => alert(error),
  //   //               () => this.logMessage.log("Implantable Device Deleted Successfull.")
  //   //             );
  //   //         }
  //   //       }, (reason) => {
  //   //         //alert(reason);
  //   //       });
  //   // }else{
  //     const modalRef = this.modalService.open(ConfirmationPopupComponent, this.poupUpOptions);
  //         modalRef.componentInstance.promptHeading = 'Confirm Removal !';
  //         modalRef.componentInstance.promptMessage = 'Are you sure you want to remove selected attachment?';
  //         let closeResult;
  //         modalRef.result.then((result) => {
  //           if (result == PromptResponseEnum.YES) {
  //             if(value.message_id == ""){
  //               this.arrAttachments.splice(index,1);
  //             }
  //           }
  //         }, (reason) => {
  //           //alert(reason);
  //         });
  //  // }



  //   }
  //   ondeleteAttachSuccessfully(data, index) {
  //       this.arrAttachments.splice(index,1);
  //   }
  getSelectedProviderName(index) {
    this.selectedProviderName = this.lookupList.providerList[index].name;
  }

  onRemoveAttachment(index: number) {
    this.lstAttachmentsAdded.splice(index, 1);
    this.lstMultiPart.splice(index, 1);
  }
}
