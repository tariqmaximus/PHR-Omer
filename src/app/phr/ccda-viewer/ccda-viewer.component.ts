import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SafePipe } from '../../shared/docSafe-pipe';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, Inject } from '@angular/core';
import { SafeResourceUrl, SafeUrl } from '@angular/platform-browser/src/security/dom_sanitization_service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';


import "../../../assets/js/phr.js";
import { EncounterService } from '../../services/encounter/encounter.service';

import { LookupList, LOOKUP_LIST } from 'src/app/providers/lookupList.module';

import { SearchCriteria } from 'src/app/models/common/search-criteria';
import { GeneralOperation } from 'src/app/shared/generalOperation';
import { FaxAttachemntsTypeEnum, PromptResponseEnum } from 'src/app/shared/enum-util';

import * as FileSaver from 'file-saver';
import { GeneralService } from 'src/app/services/general/general.service';
import { EmailSendingComponent } from '../email/email-sending/email-sending.component';
import { SendFaxAttachmentsFromClient } from 'src/app/models/general/send-fax-attachments-from-client';
import { DirectEmailSendingComponent } from '../email/direct-email/direct-email-send.component';
declare var myExtObject: any;
declare var webGlObject: any;

@Component({
  selector: 'ccda-viewer',
  templateUrl: './ccda-viewer.component.html',

  styleUrls: ['./ccda-viewer.component.css']

})

export class CCDAViewerComponent implements OnInit {
  fileUploadForm: FormGroup;
  constructor(private domSanitizer: DomSanitizer, public activeModal: NgbActiveModal, private encounterService: EncounterService
    , private formBuilder: FormBuilder, @Inject(LOOKUP_LIST) public lookupList: LookupList,
    private generalOperation: GeneralOperation,
    private modalService: NgbModal, private generalService: GeneralService) {
  }
  drugfilePath;
  healthcheckId;
  path_doc;
  html_iframe;
  current_url: SafeUrl;
  callingModule = '';
  module_id = '';
  lstFollowUp;
  followupForm: FormGroup;
  isAlreadySent;
  isLoading: boolean = false;
  xml_path;
  html_path;
  zip_path;

  ngOnInit() {
    this.fileUploadForm = this.formBuilder.group({
      RxInput: this.formBuilder.control(null, null)
    });
    this.current_url = this.domSanitizer.bypassSecurityTrustResourceUrl(this.path_doc)
    // myExtObject.loadIrx(this.XML(),"https://secure.newcropaccounts.com/InterfaceV7/RxEntry.aspx");
    webGlObject.init();
     
    
  }
  urlCache = new Map<string, SafeResourceUrl>();
  getLink(): SafeResourceUrl {
    debugger;
    var url = this.urlCache.get(this.path_doc);
    if (!url) {
      url = this.domSanitizer.bypassSecurityTrustResourceUrl(
        this.path_doc);
      this.urlCache.set("41", url);
    }
    return url;
  }
   
  openPrescriptionResponse(data) {
    debugger;
  }
   

  buildForm() {
    this.followupForm = this.formBuilder.group({
      drpFollowUp: this.formBuilder.control("", Validators.required),
      drpFollowUpaction: this.formBuilder.control("", Validators.required)
    })
  }
     
  onDownloadCCDA(value)
  {
    debugger;
    this.onDownload(value);

    
  }
  onDownload(value) {
    debugger;
    
    let searchCriteria: SearchCriteria = new SearchCriteria;
    if(value=='xml')
      searchCriteria.criteria = this.xml_path;
    else if(value=='html')
      searchCriteria.criteria = this.html_path;
      else if(value=='zip')
      searchCriteria.criteria = this.zip_path;

    this.generalService.downloadFile(searchCriteria)
      .subscribe(
        data => {
          debugger;
          this.isLoading = false;         
          this.downloafileResponse(data,searchCriteria.criteria);
        },
        error => {
          alert(error);
          this.isLoading = false;
        }
      );
  }
  downloafileResponse(data,  name) {
debugger;
    let file_ext: string = name.substring(name.indexOf('.') + 1, name.length);
    let file_type: string = '';
    let action_log='';
    let fileName:string=name.substring(name.lastIndexOf("\\")+1,name.length);
    
    switch (file_ext.toLowerCase()) {
      case 'xml':
        file_type = 'text/xml';
        action_log='XML';
        break;    
        case 'html':
          file_type = 'text/html';
          action_log='HTML';
          break;  
      case 'zip':
          file_type='application/zip';
          action_log='ZIP';
        break;

    }
    var file = new Blob([data], { type: file_type });
    //FileSaver.saveAs(file, name + "." + file_ext);
    FileSaver.saveAs(file, this.lookupList.patientInfo.last_name+' '+this.lookupList.patientInfo.first_name);

    this.generalOperation.updateLog("CCDA", this.lookupList.patientInfo.patient_id, "Download CCDA",action_log);
  }
  lgPopUpOptionsEmail: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'lg'
  };
  onTransmit(value)
  {
    if(value=='non-secure')
    {
        if(this.populateEmailAttachmentList() == true)
        {
          const modalRef = this.modalService.open(EmailSendingComponent, this.lgPopUpOptionsEmail);
          modalRef.componentInstance.lstAttachments = this.lstEmailAttachments;
          modalRef.componentInstance.callingFrom = "documents";
          modalRef.componentInstance.operation = "email";

          modalRef.result.then((result) => {
            if (result) {

            }
          }, (reason) => {

          });
      }
    }
    else{
      if(this.populateEmailAttachmentList() == true)
        {
          const modalRef = this.modalService.open(DirectEmailSendingComponent, this.lgPopUpOptionsEmail);
          modalRef.componentInstance.lstAttachments = this.lstEmailAttachments;
          modalRef.componentInstance.callingFrom = "documents";
          modalRef.componentInstance.operation = "email";

          modalRef.result.then((result) => {
            if (result) {

            }
          }, (reason) => {

          });
      }
    }
  }
  lstEmailAttachments: Array<any> = new Array<any>();
  populateEmailAttachmentList(): boolean {
    debugger;
    let isInvalidFormatSelected: boolean = false;
    this.lstEmailAttachments = new Array<any>();
    if (this.xml_path != undefined && this.xml_path!=null && this.xml_path.length > 0) {                
            let sendFaxAttachmentsFromClient: SendFaxAttachmentsFromClient = new SendFaxAttachmentsFromClient()
            let fileName:string=this.xml_path.substring(this.xml_path.lastIndexOf("\\")+1,this.xml_path.length);
            sendFaxAttachmentsFromClient.patient_document_id = "1";
            sendFaxAttachmentsFromClient.document_name = fileName;
            sendFaxAttachmentsFromClient.document_link = this.xml_path;
            sendFaxAttachmentsFromClient.document_source = FaxAttachemntsTypeEnum.CCDA;
            sendFaxAttachmentsFromClient.read_only = false;// true
            this.lstEmailAttachments.push(sendFaxAttachmentsFromClient);
        }
    return true;
  }
}
