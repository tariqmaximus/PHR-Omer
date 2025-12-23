import { Component, OnInit, Inject } from '@angular/core';
import { PhrService } from 'src/app/services/phr/phr.service';
import { LogMessage } from 'src/app/shared/log-message';
import { LookupList, LOOKUP_LIST } from 'src/app/providers/lookupList.module';
import { SearchCriteria } from 'src/app/models/common/search-criteria';
import { GeneralOperation } from 'src/app/shared/generalOperation';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { DocumentViewerComponent } from '../../../general-modules/document-viewer/document-viewer.component';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Rptlabresults_Print } from 'src/app/models/lab/Rptlabresults_Print';

@Component({
    selector: 'phr-lab-summary',
    templateUrl: './phr-lab-summary.component.html',
    styleUrls: ['./phr-lab-summary.component.css'],
    standalone: false
})
export class PhrLabSummaryComponent implements OnInit {
  //orderID = '123';
  lstPHRLabOrderSummary: Array<any>;
  lstPHRLabAttachments: Array<any>;
  downloadPath;
  selectedOrder_id;
  selectedAttachID;
  isLoading: boolean = false;
  //public cfValues: any[] =
  //[{
  //  Order: [{ order_id: '' }]
  //}];
  lgPopupUpOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'lg'
  };
  constructor(private phrService:PhrService,
    private generalOperation: GeneralOperation,
    private modalService: NgbModal,
    @Inject(LOOKUP_LIST) public lookupList: LookupList,
    @Inject(Rptlabresults_Print) private objRptLabResultPrint: Rptlabresults_Print,
    private domSanitizer: DomSanitizer,
    private logMessage: LogMessage) { }

  ngOnInit() {
    this.isLoading = true;
    this.getPatientPHRLabOrderSummary();
    if (this.lookupList.lstdocumentPath != undefined && this.lookupList.lstdocumentPath.length > 0) {
      let lstDocPath = this.generalOperation.filterArray(this.lookupList.lstdocumentPath, "category_name", "PatientDocuments");
      if (lstDocPath.length > 0)
        this.downloadPath = lstDocPath[0].upload_path + "//" + this.lookupList.practiceInfo.practiceId + "//PatientDocuments";
      else
        this.downloadPath = '';
    }
  }
  getPatientPHRLabOrderSummary(){
    this.phrService.getPatientPHRLabOrderSummary(this.lookupList.patientInfo.patient_id).subscribe(
      data => {
        lstPHRLabOrderSummary: new Array();
        this.lstPHRLabOrderSummary = data as Array<any>;
        if(this.lstPHRLabOrderSummary.length>0)
          this.getAttachments(this.lstPHRLabOrderSummary[0]);
        else
          this.isLoading = false;
        
        
      },
      error => {
        this.isLoading = false;
        return;
      }
    );
  }

  previewSelectedRecord(value){
    this.objRptLabResultPrint.order_id = value.order_id;
    this.objRptLabResultPrint.getLabResultRpt();
  }

  // labResults=false;
  // openSelectedRecord(value){
  //   this.labResults = true;
  //   //this.replyMsg[0].msgFrom = [];
  //   //this.cfValues[0].Order.pop();
  //   //this.cfValues[0].Order.push({ order_id: value.order_id.toLowerCase() });
  // }
  // onBackFromLabResult(){
  //   this.labResults = false;
  // }
  // backToSum(){
  //   this.labResults = false;
  // }
  getAttachments(value:any){
    this.selectedOrder_id = value.order_id;
    this.phrService.getLabAttachments(value.order_id).subscribe(
      data => {        
        this.lstPHRLabAttachments = data as Array<any>;
        this.isLoading = false;
      },
      error => {
        this.isLoading = false;
        return;
      }
    );
  }
  showDoc = false;
  openDocument(document) {
    this.selectedAttachID = document.patient_order_attachment_id;
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
}