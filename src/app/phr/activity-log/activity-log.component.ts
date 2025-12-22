import { Component, OnInit, Inject, ViewChildren,QueryList } from '@angular/core';
import { PhrService } from 'src/app/services/phr/phr.service';
import { LOOKUP_LIST, LookupList } from 'src/app/providers/lookupList.module';
import { LogMessage } from 'src/app/shared/log-message';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateTimeFormat, DateTimeUtil } from 'src/app/shared/date-time-util';
import { SearchCriteria } from 'src/app/models/common/search-criteria';
import { NgbdSortableHeader, SortEvent, FilterOptions, SortFilterPaginationResult, SortFilterPaginationService } from 'src/app/services/sort-filter-pagination.service';
import { GeneralOperation } from 'src/app/shared/generalOperation';
import { AlertTypeEnum } from 'src/app/shared/enum-util';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { datetimeValidator } from 'src/app/shared/custome-validators';
import { DateModel } from 'src/app/models/general/date-model';
import { ExcelColumn } from 'src/app/models/general/excel-column';
import { excelService } from 'src/app/shared/excelService';
//import { excelService } from 'src/app/shared/excelService';

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.css']
})
export class ActivityLogComponent implements OnInit {

  lstActivityLog: Array<any>;
  lstActivityLogDB: Array<any>;
  selectedRowID;
  isLoading: boolean = false;
  filterForm:FormGroup;
  constructor(@Inject(LOOKUP_LIST) public lookupList: LookupList,private excel: excelService,
  private sortFilterPaginationService: SortFilterPaginationService,private ngbModal: NgbModal,
  private phrService:PhrService,private formBuilder: FormBuilder,private dateTimeUtil: DateTimeUtil,
  private logMessage:LogMessage) { }

  ngOnInit() {
    this.buildForm();
    this.getPHRActivityLog();
  }
  buildForm() {
    this.filterForm = this.formBuilder.group({
      dateFrom: this.formBuilder.control(this.dateTimeUtil.getCurrentDateModel(), Validators.compose([
        Validators.required,
        datetimeValidator(DateTimeFormat.DATEFORMAT_MM_DD_YYYY)
      ])),
      dateTo: this.formBuilder.control(this.dateTimeUtil.getCurrentDateModel(),  Validators.compose([
        Validators.required,
        datetimeValidator(DateTimeFormat.DATEFORMAT_MM_DD_YYYY)
      ])),      
      tpFromTime: this.formBuilder.control(this.dateTimeUtil.getCurrentTimeModel(), Validators.required),
      tpToTime: this.formBuilder.control(this.dateTimeUtil.getCurrentTimeModel(), Validators.required),
      cmbaction:this.formBuilder.control("", null),
    })
  }

  onSearchClick(formData)
  {
    debugger;
    if (formData.dateFrom == "" || formData.dateFrom == null) {
      GeneralOperation.showAlertPopUp(this.ngbModal, "Validation", "Please Enter From Date", 'warning')
      return;
    }
    if (formData.dateTo == "" || formData.dateTo == null) {
      GeneralOperation.showAlertPopUp(this.ngbModal, "Validation", "Please Enter To Date", 'warning')
      return;
    }

    let strMsg: string = '';
    if (formData.dateFrom != undefined && formData.dateFrom != '' && formData.dateTo != undefined && formData.dateTo != '') {
      strMsg = this.dateTimeUtil.validateDateFromDateTo(formData.dateFrom, formData.dateTo, DateTimeFormat.DATE_MODEL, false, true);
    }
    if (strMsg != '') {
      GeneralOperation.showAlertPopUp(this.ngbModal, 'Date Validation', strMsg, AlertTypeEnum.DANGER)
      return false;
    }
    this.isLoading=true;
    let reportSearchCriteria:SearchCriteria = new SearchCriteria();
    //reportSearchCriteria.practice_id = this.lookupList.practiceInfo.practiceId;
    reportSearchCriteria.param_list = [];

    let dateFrom = this.dateTimeUtil.getStringDateFromDateModel(formData.dateFrom);
    let dateTo = this.dateTimeUtil.getStringDateFromDateModel(formData.dateTo);

    reportSearchCriteria.param_list.push({ name: "patient_id", value: this.lookupList.patientInfo.patient_id, option: "" });
    reportSearchCriteria.param_list.push({ name: "DateFrom", value: dateFrom+' '+this.dateTimeUtil.getStringTimeFromTimeModel(formData.tpFromTime), option: "" });
    reportSearchCriteria.param_list.push({ name: "DateTo", value: dateTo+' '+this.dateTimeUtil.getStringTimeFromTimeModel(formData.tpToTime), option: "" });
    reportSearchCriteria.param_list.push({ name: "action_type", value: formData.cmbaction, option: "" });
    
    this.phrService.getPHRActivityLog(reportSearchCriteria).subscribe(
      data => {
        this.isLoading=false;
        //this.lstEncounter = data;
        //this.lstActivityLog =  data as Array<any>;
        this.lstActivityLogDB=  data as Array<any>;
        this.search();
        this.isLoading = false;
      },
      error => {
        this.logMessage.log("getPHREncounterSummary " + error);
        this.isLoading = false;
      }
    );
  }
  //GeneralOptions.practiceID,patientID,GeneralOptions.loginUser)
  getPHRActivityLog  () {

    this.onSearchClick(this.filterForm.value);
    

    // this.phrService.getPHRActivityLog(this.lookupList.practiceInfo.practiceId.toString(), this.lookupList.patientInfo.patient_id).subscribe(
    //   data => {
    //     this.lstActivityLog =  data as Array<any>;
    //     this.selectClickedRow(this.lstActivityLog[0]);
    //     this.isLoading = false;
    //   },
    //   error => {
    //     this.logMessage.log("getPHRActivityLog " + error);
    //     this.isLoading = false;
    //   }
    // );
  }
  selectClickedRow(value){
    this.selectedRowID = value.col1;
  }
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  sortEvent: SortEvent;

  onSort(sortEvent: SortEvent) {
    this.sortEvent = sortEvent;
    this.search();
  }

  private search() {

    let sortFilterPaginationResult: SortFilterPaginationResult = this.sortFilterPaginationService.search(this.lstActivityLogDB, this.headers, this.sortEvent, null, null, '');
    debugger;
    this.lstActivityLog = sortFilterPaginationResult.list;
  }
  onDateFocusOut(date: string, controlName: string) {

    // console.log('focus out Called:');
    let formatedDate: DateModel = this.dateTimeUtil.getDateFromDigitsOnly(date, DateTimeFormat.DATE_MODEL);
    if (formatedDate != undefined) {
      this.filterForm.get(controlName).setValue(formatedDate);
    }
  }
  exportExcel()
  {
    this.excel.exportAsExcelFile(this.lstActivityLog, 'access_date,user_name,module_name,access,', 'PHR_Activity_Log');

    
  
  }
  
}
