import { Component, OnInit, Inject } from '@angular/core';
import { GeneralService } from 'src/app/services/general/general.service';
import { LOOKUP_LIST, LookupList } from 'src/app/providers/lookupList.module';
import { LogMessage } from 'src/app/shared/log-message';
import { Chartreport_Print } from 'src/app/models/charts/Chartreport_Print';
import { GeneralOperation } from 'src/app/shared/generalOperation';
import { ORMCCDRequest } from 'src/app/models/charts/ORMCCDRequest';
import { EncounterService } from 'src/app/services/encounter/encounter.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { CCDAViewerComponent } from '../ccda-viewer/ccda-viewer.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateTimeFormat, DateTimeUtil } from 'src/app/shared/date-time-util';
import { SearchCriteria } from 'src/app/models/common/search-criteria';

@Component({
  selector: 'encounter-summary',
  templateUrl: './encounter-summary.component.html',
  styleUrls: ['./encounter-summary.component.css']
})
export class EncounterSummaryComponent implements OnInit {
  
  lstPHREncounterSummary: Array<any>;
  isSelectedChartID;
  isLoading: boolean = false;
  encounterReportForm:FormGroup;

  constructor(@Inject(LOOKUP_LIST) public lookupList: LookupList,
  @Inject(Chartreport_Print) private objchartReport: Chartreport_Print,
  private generalService: GeneralService,private ngbModal: NgbModal,
  private dateTimeUtil: DateTimeUtil,
  private encounterService: EncounterService, private formBuilder: FormBuilder,
  private GeneralOperation: GeneralOperation,
  private logMessage:LogMessage) { }

  ngOnInit() {
    this.isLoading = true;
    this.buildForm();
    this.getPHREncounterSummary();
  }
  buildForm() {
    this.encounterReportForm = this.formBuilder.group({
      dateFrom: this.formBuilder.control(this.dateTimeUtil.getCurrentDateModel(), null),
      dateTo: this.formBuilder.control(this.dateTimeUtil.getCurrentDateModel(), null)
      
    })
  }

  getPHREncounterSummary  () {

    let reportSearchCriteria:SearchCriteria = new SearchCriteria();
    //reportSearchCriteria.practice_id = this.lookupList.practiceInfo.practiceId;
    reportSearchCriteria.param_list = [];

    reportSearchCriteria.param_list.push({ name: "patient_id", value: this.lookupList.patientInfo.patient_id, option: "" });
    
    this.generalService.getPHREncounterSummary(reportSearchCriteria).subscribe(
      data => {
        //this.lstEncounter = data;
        this.lstPHREncounterSummary =  data as Array<any>;
        this.isLoading = false;
      },
      error => {
        this.logMessage.log("getPHREncounterSummary " + error);
        this.isLoading = false;
      }
    );
    
  }
  previewSelectedChart(value) {
    debugger;
    //this.isLoading = true;
    this.objchartReport.chartId = value.chart_id;
    this.objchartReport.patientId = value.patient_id;
    // if(this.lookupList.logedInUser.acPrintSetting)
    //   this.objchartReport.acPrintSettings = this.lookupList.logedInUser.acPrintSetting.split("~");
    
    this.objchartReport.getReportData();
    this.GeneralOperation.updateLog("Encounter", this.lookupList.patientInfo.patient_id, "View"," dated "+value.visit_date);
    
  }
  generateCCDA(value)
  {
    this.isLoading=true;
    let objccdReq: ORMCCDRequest = new ORMCCDRequest;
    objccdReq.patient_id = value.patient_id;
    objccdReq.chart_id = value.chart_id;
    objccdReq.practice_id = this.lookupList.practiceInfo.practiceId.toString();
    objccdReq.provider_id = value.provider_id;
   // objccdReq.user_id = this.lookupList.logedInUser.userId.toString();
    objccdReq.isReferal = false;
    objccdReq.ccd_Version = "0";
    objccdReq.ccd_type = 'toc';

    this.encounterService.GenerateCCDA(objccdReq).subscribe(
      data => {
        this.GeneralOperation.updateLog("CCDA", this.lookupList.patientInfo.patient_id, "View","");
        debugger;
        this.isLoading=false;
        // = data["result"].split("~")[0];
        const modalRef = this.ngbModal.open(CCDAViewerComponent, this.xLgPopUpOptions);
        modalRef.componentInstance.path_doc = data["result"].split("~")[0];
        modalRef.componentInstance.xml_path=data["result"].split("~")[1];
        modalRef.componentInstance.html_path=data["result"].split("~")[3];
        modalRef.componentInstance.zip_path=data["result"].split("~")[4];
        modalRef.componentInstance.width = '800px';
      },
      error => {
        this.isLoading=false;
        this.logMessage.log("newchart " + error);
      }
    );
  }
  changeRowSelection(row){
    this.isSelectedChartID = row.chart_id;
  }
  xLgPopUpOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'lg',
    windowClass: 'modal-adaptive'
  };
  onSearchClick(formData)
  {
    this.isLoading=true;
    let reportSearchCriteria:SearchCriteria = new SearchCriteria();
    //reportSearchCriteria.practice_id = this.lookupList.practiceInfo.practiceId;
    reportSearchCriteria.param_list = [];

    let dateFrom = this.dateTimeUtil.getStringDateFromDateModel(formData.dateFrom);
    let dateTo = this.dateTimeUtil.getStringDateFromDateModel(formData.dateTo);

    reportSearchCriteria.param_list.push({ name: "patient_id", value: this.lookupList.patientInfo.patient_id, option: "" });
    reportSearchCriteria.param_list.push({ name: "date_from", value: dateFrom, option: "" });
    reportSearchCriteria.param_list.push({ name: "date_to", value: dateTo, option: "" });
    
    this.generalService.getPHREncounterSummary(reportSearchCriteria).subscribe(
      data => {
        this.isLoading=false;
        //this.lstEncounter = data;
        this.lstPHREncounterSummary =  data as Array<any>;
        this.isLoading = false;
      },
      error => {
        this.logMessage.log("getPHREncounterSummary " + error);
        this.isLoading = false;
      }
    );
  }
}
