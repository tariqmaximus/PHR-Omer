import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { AbstractControl, FormGroup, FormBuilder } from '@angular/forms';
import { LookupList, LOOKUP_LIST } from 'src/app/providers/lookupList.module';
import { LogMessage } from 'src/app/shared/log-message';
import { PhrService } from 'src/app/services/phr/phr.service';
import { ConfirmationPopupComponent } from 'src/app/general-modules/confirmation-popup/confirmation-popup.component';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { PromptResponseEnum } from 'src/app/shared/enum-util';
import { SearchCriteria } from 'src/app/models/common/search-criteria';
import { GeneralOperation } from 'src/app/shared/generalOperation';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { DocumentViewerComponent } from '../../../general-modules/document-viewer/document-viewer.component';
import { DateTimeUtil } from 'src/app/shared/date-time-util';
import { ORMKeyValue } from 'src/app/models/general/orm-key-value';
import { ComposeMessageParams } from 'src/app/models/messages/compse-messge-params';

@Component({
    selector: 'phr-message-inbox',
    templateUrl: './phr-message-inbox.component.html',
    styleUrls: ['./phr-message-inbox.component.css'],
    standalone: false
})
export class PhrMessageInboxComponent implements OnInit {
  @Input() isNewMessage;
  @Output() onCloseNewMessagebkpMain = new EventEmitter<any>();
  @Input() message_type;
  msgPatAttachmentsList;
  lstMessages;
  lstAmendent;
  MessageDetail;
  message_detail_id;
  msg_selected_body;
  msg_sender_id;
  // msg_detail_from;
  // msg_detail_to;
  // msg_detail_cc;
  // msg_detail_subject;
  // msg_detail_body;
  // msg_detail_date;
  //msg_detail_subject;
  //msg_user_name;
  //msg_recieve_date;
  //msg_mess_to;
  msg_amendment_check;
  //msg_provider;
  //selectedMessage_id;
  selectedrequest_id;
  objSelectedMessageDetail;
  indexSelected;
  downloadPath;
  showInArchive;
  quilMessageHeaderEdit: FormGroup;
  public messageTextView: AbstractControl;

  //patientId: number = 0;
  isLoading: boolean = false;



  messageID: number = 0;
  messageThreadId: number = 0;
  messagePatientId: number = 0;
  messagePatientName: string = '';
  messageSenderUserName: string = '';
  messageSenderName: string = '';
  messageReceiverName: string = '';
  messageSenderId: number = 0;
  messageReceiverId: number = 0;
  subject: string = '';
  messageDate: string = '';
  messageProviderId: number = 0;
  messageProviderName: string = '';

  messageBodyHTML: string = '';
  messageBodyTxt: string = '';

  loadingMessageDetailCount: number = 0;
  isLoadingMessageDetail: boolean = false;

  lgPopupUpOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'lg'
  };


  constructor(@Inject(LOOKUP_LIST) public lookupList: LookupList,
    private logMessage: LogMessage,
    private modalService: NgbModal,
    private generalOperation: GeneralOperation,
    private formBuilder: FormBuilder,
    private dateTimeUtil: DateTimeUtil,
    private domSanitizer: DomSanitizer,
    private phrService: PhrService) {

    //this.patientId = this.lookupList.patientInfo.patient_id.toString();

    this.quilMessageHeaderEdit = formBuilder.group({
      'messageTextView': [''],
    });
    this.messageTextView = this.quilMessageHeaderEdit.controls['messageTextView'];

  }

  // public replyMsg: any =
  //   {
  //     msgFrom: [{ msg_from: '' }],
  //     selectedProvider: [{ selected_provider: '' }],
  //     selectedProviderName: [{ selected_provider_name: '' }],
  //     msgType: [{ msg_type: '' }],
  //     msgSubject: [{ msg_subject: '' }],
  //     msgText: [{ msg_text: '' }],
  //     msgId: [{ msg_id: '' }],
  //     amendment: [{ msg_Amendment: '' }],
  //     attachments: [{ msg_Attachments: '' }]
  //   };

  cmposeMessageParams: ComposeMessageParams;

  ngOnInit() {
    if (this.lookupList.lstdocumentPath != undefined && this.lookupList.lstdocumentPath.length > 0) {
      let lstDocPath = this.generalOperation.filterArray(this.lookupList.lstdocumentPath, "category_name", "Messages");
      if (lstDocPath.length > 0)
        this.downloadPath = lstDocPath[0].upload_path + "//" + this.lookupList.practiceInfo.practiceId + "//Messages";
      else
        this.downloadPath = '';
    }
  }
  ngOnChanges() {
    debugger;
    if (this.message_type == "Amendment") {
      this.showInArchive = "Amendment";
      this.getPatientAmendments();
    }
    else {
      //this.getPatientMessages();
      this.getMessageList();
    }
    //this.onGetMessageList();
    if (this.message_type == "Inbox") {
      this.showInArchive = "inbox";
    }
    else if (this.message_type == "Draft") {
      this.showInArchive = "draft";
    }
    else if (this.message_type == "Sent") {
      this.showInArchive = "sent";
    }
    else if (this.message_type == "Deleted") {
      this.showInArchive = "deleted";
    }
    else if (this.message_type == "Archive") {
      this.showInArchive = "archive";
    }

  }
  getPatientMessageDetail() {
    debugger;
    //this.phrService.getPatientMessages(this.patientId, this.lookupList.logedInUser.user_name, this.message_type, this.lookupList.logedInUser.userId.toString()) 

    this.phrService.getPatientMessageDetail(this.lookupList.patientInfo.patient_id, this.messageID)
      .subscribe(
        data => {
          this.objSelectedMessageDetail = data;
          this.assignMessageValues();
          //if (this.lstMessages != undefined && this.lstMessages.length > 0)
          //  this.onMessageChange(data[0], 0);
          //this.onMessageClick(this.lstMessagelist[0].message_id);
          //this.isLoading = false;

          this.loadingMessageDetailCount--;
          if (this.loadingMessageDetailCount <= 0) {
            this.isLoadingMessageDetail = false
          }
        },
        error => {
          this.logMessage.log("An Error Occured while getting getPatientMessages list.")
          //this.isLoading = false;
          this.isLoadingMessageDetail = false
        }
      );
  }
  getMessageList() {

    this.clearAll();
    this.phrService.getMessageslist(this.lookupList.patientInfo.patient_id, this.message_type)
      .subscribe(
        data => {
          this.lstMessages = data;
          //this.selectedMessageDetail = data;
          //this.assignMessageValues();
          //this.onMessageClick(this.lstMessagelist[0].message_id);
          this.isLoading = false;

          if (this.lstMessages != undefined && this.lstMessages.length > 0) {
            this.onMessageChange(this.lstMessages[0], 0);
          }
        },
        error => {
          this.logMessage.log("An Error Occured while getting getMessages list.")
          //this.isLoading = false;
        }
      );
  }



  assignMessageValues() {

    if (this.objSelectedMessageDetail == undefined)
      return;
    debugger;
    this.messageID = this.objSelectedMessageDetail.message_id;
    this.messageThreadId = this.objSelectedMessageDetail.message_thread_id

    this.messageDate = this.objSelectedMessageDetail.message_date;
    this.subject = this.objSelectedMessageDetail.message_subject;
    this.messageSenderUserName = this.objSelectedMessageDetail.sender_user_name;
    this.messageSenderName = this.objSelectedMessageDetail.sender_name;
    this.messageReceiverName = this.objSelectedMessageDetail.receiver_name;

    this.messageSenderId = this.objSelectedMessageDetail.sender_id;
    this.messageReceiverId = this.objSelectedMessageDetail.receiver_id;



    this.messagePatientId = this.objSelectedMessageDetail.patient_id;
    this.messagePatientName = this.objSelectedMessageDetail.patient_name;

    this.messageProviderId = this.objSelectedMessageDetail.provider_id;
    this.messageProviderName = this.objSelectedMessageDetail.provider_name;

    this.messageBodyHTML = this.objSelectedMessageDetail.message_body_html.trim();
    this.messageBodyTxt = this.objSelectedMessageDetail.message_body_text;



    //******************************* */

    // this.msg_detail_subject = "";
    // this.msg_user_name = "";
    // this.msg_recieve_date = "";
    // this.msg_mess_to = "";
    // this.msg_amendment_check = "";
    // this.msg_provider = "";

    //if (this.selectedMessageDetail != undefined && this.selectedMessageDetail != null) {
    //this.msg_detail_subject = this.selectedMessageDetail.subject;
    //this.msg_user_name = this.selectedMessageDetail.user_name;
    //this.msg_recieve_date = this.selectedMessageDetail.message_date;// values.recieve_date;
    //this.msg_mess_to = this.selectedMessageDetail.message_to;
    this.quilMessageHeaderEdit = this.formBuilder.group({
      'messageTextView': [this.objSelectedMessageDetail.message_body_html.trim()],
    });
    this.messageTextView = this.quilMessageHeaderEdit.controls['messageTextView'];
    this.msg_amendment_check = this.objSelectedMessageDetail.is_amendments;
    //this.msg_provider = this.selectedMessageDetail.user_name;
    //}
    //this.msg_selected_body = this.selectedMessageDetail.mess_body_html.trim();
    //this.msg_sender_id = this.selectedMessageDetail.from_id;// values.sender_id;

    //this.getPatientMsgAttachments();

    if (!this.objSelectedMessageDetail.is_read) {
      this.markMessageAsRead();
    }

  }

  clearAll() {

    this.quilMessageHeaderEdit = this.formBuilder.group({
      'messageTextView': [''],
    });
    this.messageTextView = this.quilMessageHeaderEdit.controls['messageTextView'];
    this.msg_amendment_check = false;

    this.messageID = 0;
    this.messageThreadId = 0;
    this.messageBodyHTML = '';
    this.messageBodyTxt = '';
    this.messageDate = '';
    this.messagePatientId = 0;
    this.messagePatientName = '';
    this.messageProviderId = 0;
    this.messageProviderName = '';
    this.messageReceiverId = 0;
    this.messageReceiverName = '';
    this.messageSenderId = 0;
    this.messageSenderName = '';
    this.messageSenderUserName = '';
    this.subject = '';
    this.msgPatAttachmentsList = undefined;
  }


  onMessageChange(objMessage: any, index) {

    this.clearAll();
    this.messageID = objMessage.message_id;
    this.messageThreadId = objMessage.message_thread_id;
    this.indexSelected = index;

    this.loadingMessageDetailCount = 2;
    this.isLoadingMessageDetail = true;



    this.getPatientMessageDetail();
    this.getPatientMsgAttachments();
    // if (values == undefined) {
    //   return;
    // }
    //this.selectedMessageDetail = values;
    //this.selectedMessage_id = values.message_id;    
  }

  markMessageAsRead() {

    //this.strOperation = "readed";
    let patientMessageStatus: Array<ORMKeyValue> = new Array<ORMKeyValue>();
    patientMessageStatus.push(new ORMKeyValue("client_date_modified", this.dateTimeUtil.getCurrentDateTimeString()));
    patientMessageStatus.push(new ORMKeyValue("modified_user", this.lookupList.logedInUser.user_name));
    patientMessageStatus.push(new ORMKeyValue("message_id", this.messageID));
    this.phrService.markMessageAsRead(patientMessageStatus)
      .subscribe(
        data => {
          // this.onupdateToReaded(data)
        },
        error => alert(error),
        () => this.logMessage.log("Patient message status changed to read.")
      );

  }


  getPatientMsgAttachments() {
    this.phrService.getPatientMsgAttachments(this.lookupList.patientInfo.patient_id, this.messageID).subscribe(
      data => {


        this.msgPatAttachmentsList = data as Array<any>;

        this.loadingMessageDetailCount--;
        if (this.loadingMessageDetailCount <= 0) {
          this.isLoadingMessageDetail = false
        }
      },
      error => {
        this.getPatientMsgAttachmentsError(error);
        this.isLoadingMessageDetail = false
      }
    );
  }
  getPatientMsgAttachmentsError(error) {
    this.logMessage.log("getPatientMsgAttachments Error." + error);
  }

  replySelectedMessage(value) {

    this.cmposeMessageParams = new ComposeMessageParams();
    this.cmposeMessageParams.messageId = this.messageID;
    this.cmposeMessageParams.messageThreadId = this.messageThreadId;
    this.cmposeMessageParams.subject = this.subject;
    this.cmposeMessageParams.providerId = this.messageProviderId;
    this.cmposeMessageParams.providerName = this.messageProviderName;
    this.cmposeMessageParams.messageBodyHtml = this.messageBodyHTML;
    this.cmposeMessageParams.messageBodyText = this.messageBodyTxt;
    this.cmposeMessageParams.message_type = 'reply';
    this.isNewMessage = true;



    // var strBody: String = "<p><br/></p><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"></P></TEXTFORMAT>" +
    //   "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Verdana\" SIZE=\"10\" COLOR=\"#e6e6e6\" LETTERSPACING=\"0\" KERNING=\"0\">_____________________________________________________________</FONT>" +
    //   "</P></TEXTFORMAT>";
    // strBody = strBody + "<TEXTFORMAT LEADING='2'><P ALIGN='LEFT'></P></TEXTFORMAT>" +
    //   "<TEXTFORMAT LEADING='2'><P ALIGN='LEFT'><FONT FACE='Verdana' SIZE='11' LETTERSPACING='0' KERNING='0'><B>From: </B>" + this.msg_user_name + "</FONT></P></TEXTFORMAT>" +
    //   "<TEXTFORMAT LEADING='2'><P ALIGN='LEFT'><FONT FACE='Verdana' SIZE='11' LETTERSPACING='0' KERNING='0'><B>Sent: </B> " + this.msg_recieve_date + "</FONT></P></TEXTFORMAT>" +
    //   "<TEXTFORMAT LEADING='2'><P ALIGN='LEFT'><FONT FACE='Verdana' SIZE='11' LETTERSPACING='0' KERNING='0'><B>To: </B> " + this.msg_mess_to + "</FONT></P></TEXTFORMAT>" +
    //   "<TEXTFORMAT LEADING='2'><P ALIGN='LEFT'><FONT FACE='Verdana' SIZE='11' LETTERSPACING='0' KERNING='0'><B>Subject:</B> " + this.msg_detail_subject + "</FONT></P></TEXTFORMAT>" +
    //   "<TEXTFORMAT LEADING='2'><P ALIGN='LEFT'><FONT FACE='Verdana' SIZE='10' LETTERSPACING='0' KERNING='0'></FONT></P></TEXTFORMAT><p><br/></p>";

    // this.replyMsg.msgId.pop();
    // this.replyMsg.msgText.pop();
    // this.replyMsg.msgSubject.pop();
    // this.replyMsg.msgType.pop();
    // this.replyMsg.selectedProvider.pop();
    // this.replyMsg.msgFrom.pop();
    // this.replyMsg.amendment.pop();
    // this.replyMsg.attachments.pop();
    // this.replyMsg.selectedProviderName.pop();

    // if (value == "reply") {
    //   this.replyMsg.msgType.push({ action_type: "reply" });
    //   this.replyMsg.msgSubject.push({ msg_subj: this.msg_detail_subject });

    //   if (this.msgPatAttachmentsList != null) {
    //     this.replyMsg.attachments.push({ msg_Attachments: "" });
    //   }

    // } else if (value == "forward") {
    //   this.replyMsg.msgType.push({ action_type: "forward" });
    //   this.replyMsg.msgSubject.push({ msg_subj: "FW: " + this.msg_detail_subject });

    //   if (this.msgPatAttachmentsList != null) {
    //     this.replyMsg.attachments.push({ msg_Attachments: this.msgPatAttachmentsList });
    //   }
    // }
    // this.replyMsg.msgFrom.push({ name: this.msg_user_name.toLowerCase() });
    // this.replyMsg.msgText.push({ msg_text: strBody + this.msg_selected_body });
    // this.replyMsg.msgId.push({ msg_id: this.messageID });
    // this.replyMsg.selectedProvider.push({ msg_selected_provider: this.msg_sender_id });//this.msg_provider
    // this.replyMsg.amendment.push({ msg_Amendment: this.msg_amendment_check });
    // this.replyMsg.selectedProviderName.push({ selected_provider_name: this.msg_provider });
    //selectedProvider

  }

  onCloseNewMessage() {
    this.isNewMessage = false;
    this.onCloseNewMessagebkpMain.emit();
    // this.msg_selected_body = "";
    // this.replyMsg.msgId = [];
    // this.replyMsg.msgText = [];
    // this.replyMsg.msgSubject = [];
    // this.replyMsg.msgType = [];
    // this.replyMsg.selectedProvider = [];
    // this.replyMsg.msgFrom = [];
    // this.replyMsg.amendment = [];

    this.cmposeMessageParams = undefined;



    //this.getPatientMessages();
  }
  // onMessageClick(msg_id) {
  //   this.message_id = msg_id;
  //   this.msg_detail_from = '';
  //   this.msg_detail_to = '';
  //   this.msg_detail_cc = '';
  //   this.msg_detail_subject = '';
  //   this.msg_detail_body = '';
  //   this.msg_detail_date = '';
  //   this.phrService.getMessageDetail(msg_id, this.lookupList.logedInUser.userId.toString(), this.message_type)
  //     .subscribe(
  //       data => {
  //         this.MessageDetail = data;
  //         this.msg_detail_from = this.MessageDetail.created_user;
  //         this.msg_detail_to = this.MessageDetail.mess_to;
  //         this.msg_detail_cc = this.MessageDetail.mess_cc;
  //         this.msg_detail_subject = this.MessageDetail.mess_subject;
  //         this.msg_detail_date = this.MessageDetail.client_date_modified;
  //         this.message_detail_id = this.MessageDetail.message_detail_id;
  //         this.quilMessageHeaderEdit = this.formBuilder.group({
  //           'messageTextView': [this.MessageDetail.mess_body_html.trim()],
  //         });
  //         this.messageTextView = this.quilMessageHeaderEdit.controls['messageTextView'];
  //         this.msg_selected_body = this.MessageDetail.mess_body_html.trim();
  //         //this.isLoading = false;
  //       },
  //       error => {
  //         this.logMessage.log("An Error Occured while getting getMessages list.")
  //         //this.isLoading = false;
  //       }
  //     );
  // }
  poupUpOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false
  };
  deletearchiveSelectedMessage(value) {
    const modalRef = this.modalService.open(ConfirmationPopupComponent, this.poupUpOptions);
    if (value == "delete") {
      modalRef.componentInstance.promptHeading = 'Cofirm Deletion !';
      modalRef.componentInstance.promptMessage = 'Are you sure you want to delete selected message?';
    } else if (value == "archive") {
      modalRef.componentInstance.promptHeading = 'Cofirm Archive !';
      modalRef.componentInstance.promptMessage = 'Are you sure you want to archive selected message?';
    }
    let closeResult;
    modalRef.result.then((result) => {

      if (result == PromptResponseEnum.YES) {
        let msgType = "";
        if (value == "archive") {
          msgType = "archive";
        } else {
          msgType = "phr_delete"
        }


        let searchCriteria: SearchCriteria = new SearchCriteria();
        //searchCriteria.practice_id = this.lookupList.practiceInfo.practiceId;
        searchCriteria.param_list = [
          { name: "column_id", value: this.messageID, option: "" },
          { name: "modified_user", value: this.lookupList.logedInUser.user_name, option: "" },
          { name: "client_date_modified", value: this.dateTimeUtil.getCurrentDateTimeString(), option: "" },
          { name: "client_ip", value: this.lookupList.logedInUser.systemIp, option: "" },
          { name: "msg_Type", value: msgType, option: "" }
        ];

        this.phrService.deletePatMsg(searchCriteria)
          .subscribe(
            (data: any) => {
              if (data > 0) {
                this.refreshSendReceive();
              }
            },
            error => alert(error),
            () => this.logMessage.log("Selected Record archive Successfull.")
          );
      }
    }, (reason) => {
      //alert(reason);
    });








    // if (value == "archive") {
    //     if (this.lstMessagelist[this.indexSelected].mail_status != "archive") {
    //       const modalRef = this.modalService.open(ConfirmationPopupComponent, this.poupUpOptions);
    //       modalRef.componentInstance.promptHeading = 'Cofirm Archive !';
    //       modalRef.componentInstance.promptMessage = 'Are you sure you want to archive this message?';
    //       let closeResult;
    //       modalRef.result.then((result) => {
    //         if (result == PromptResponseEnum.YES) {
    //           let msgType = "";
    //           msgType = "archive";
    //           let searchCriteria: SearchCriteria = new SearchCriteria();
    //           //searchCriteria.practice_id = this.lookupList.practiceInfo.practiceId;
    //           searchCriteria.param_list = [
    //             { name: "column_id", value: this.selectedMessageDetail.message_detail_id, option: "" },
    //             { name: "modified_user", value: this.lookupList.logedInUser.user_name, option: "" },
    //             { name: "client_date_modified", value: "2019-05-31 17:11:01.000", option: "" },
    //             { name: "client_ip", value: this.lookupList.logedInUser.systemIp, option: "" },
    //             { name: "callingFrom", value: "archive", option: "" }
    //           ];

    //           this.phrService.updateMessage(searchCriteria)
    //             .subscribe(
    //               data => this.updateMessage(data, this.indexSelected),
    //               error => alert(error),
    //               () => this.logMessage.log("Selected Record archive Successfull.")
    //             );
    //         }
    //       }, (reason) => {
    //         //alert(reason);
    //       });
    //     }

    // }
  }
  updateMessage(data, index) {
    debugger;
    this.lstMessages[index].readed = true;

    //this.lstMessagelist.splice(index, 1)
  }
  showDoc = false;
  openDocument(document) {
    this.showDoc = true;
    let searchCriteria: SearchCriteria = new SearchCriteria;
    searchCriteria.criteria = this.downloadPath + "/" + document.link;
    this.phrService.downloadFile(searchCriteria)
      .subscribe(
        data => {
          this.downloafileResponse(data, document.link);
        },
        error => alert(error)
      );
  }
  doc_path = '';
  downloafileResponse(data, doc_link) {
    let file_ext: string = doc_link.substring(doc_link.indexOf('.') + 1, doc_link.length);
    let file_type: string = '';
    switch (file_ext.toLowerCase()) {
      case 'png':
        file_type = 'IMAGE/PNG';
        break;
      case 'jpg':
        file_type = 'IMAGE/JPEG';
        break;
      case 'pdf':
        file_type = 'application/pdf';
        break;
      case 'txt':
        file_type = 'text/plain';
        break;
    }
    var file = new Blob([data], { type: file_type });//, {type: 'application/pdf'}
    var fileURL = URL.createObjectURL(file);
    let path = fileURL;

    this.doc_path = path;
    this.getLink();
    const modalRef = this.modalService.open(DocumentViewerComponent, this.lgPopupUpOptions);
    modalRef.componentInstance.path_doc = path;
    //modalRef.componentInstance.width='800px';

    // this.req_document=data;
    // String encodedImage = Base64.encode(res);

  }
  urlCache = new Map<string, SafeResourceUrl>();
  getLink(): SafeResourceUrl {
    var url = this.urlCache.get(this.doc_path);
    if (!url) {
      url = this.domSanitizer.bypassSecurityTrustResourceUrl(
        this.doc_path);
      this.urlCache.set("41", url);
    }
    return url;
  }
  onNewMessage() {
    debugger;
    this.cmposeMessageParams = new ComposeMessageParams();
    this.cmposeMessageParams.message_type = 'new';
    this.isNewMessage = true;

    //this.replyMsg = new ();
    //this.replyMsg.msgId.pop();
    //this.replyMsg.msgText.pop();
    //this.replyMsg.msgSubject.pop();
    //this.replyMsg.msgType.pop();
    //this.replyMsg.selectedProvider.pop();
    //this.replyMsg.msgFrom.pop();
    //this.replyMsg.amendment.pop();
    //this.replyMsg.msgFrom({ name: this.msg_user_name.toLowerCase() });
  }
  refreshSendReceive() {
    this.getMessageList();
  }
  getPatientAmendments() {
    debugger;
    //this.phrService.getPatientMessages(this.patientId, this.lookupList.logedInUser.user_name, this.message_type, this.lookupList.logedInUser.userId.toString()) 
    let searchCriteria: SearchCriteria = new SearchCriteria();
    //searchCriteria.practice_id = this.lookupList.practiceInfo.practiceId;
    searchCriteria.param_list = [
      { name: "patient_id", value: this.lookupList.patientInfo.patient_id.toString(), option: "" }
    ];
    this.phrService.getAmendmentRequest(searchCriteria)
      .subscribe(
        data => {
          this.lstAmendent = data;
          if (this.lstAmendent != null && this.lstAmendent.length > 0) {
            this.selectedrequest_id = this.lstAmendent[0].request_id
          }
        },
        error => {
          this.logMessage.log("An Error Occured while getting getAmendmentRequest list.")
          //this.isLoading = false;
        }
      );
  }
}