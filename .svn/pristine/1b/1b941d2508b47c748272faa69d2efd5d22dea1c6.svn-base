import { Component, OnInit, Inject,QueryList,ViewChildren } from '@angular/core';
import { LOOKUP_LIST, LookupList } from 'src/app/providers/lookupList.module';
import { PhrService } from 'src/app/services/phr/phr.service';
import { DateTimeFormat, DateTimeUtil } from 'src/app/shared/date-time-util';
import { LogMessage } from 'src/app/shared/log-message';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbdSortableHeader, SortEvent, FilterOptions, SortFilterPaginationResult, SortFilterPaginationService } from 'src/app/services/sort-filter-pagination.service';
import { SearchCriteria } from 'src/app/models/common/search-criteria';
import { GeneralOperation } from 'src/app/shared/generalOperation';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertTypeEnum } from 'src/app/shared/enum-util';
@Component({
  selector: 'app-login-log',
  templateUrl: './login-log.component.html',
  styleUrls: ['./login-log.component.css']
})
export class LoginLogComponent implements OnInit {

  lstLoginLog: Array<any>;
  lstLoginLogDB: Array<any>;
  selectedRowID;
  isLoading: boolean = false;
  filterForm:FormGroup;
  constructor(@Inject(LOOKUP_LIST) public lookupList: LookupList,private sortFilterPaginationService: SortFilterPaginationService,
  private phrService:PhrService,private formBuilder: FormBuilder,private dateTimeUtil: DateTimeUtil,
  private logMessage:LogMessage,private ngbModal: NgbModal) { }

  ngOnInit() {
    this.isLoading = true;
    this.buildForm();
    this.getPHRLoginLog();
    
  } 
  buildForm() {
    this.filterForm = this.formBuilder.group({
      dateFrom: this.formBuilder.control(this.dateTimeUtil.getCurrentDateModel(), null),
      dateTo: this.formBuilder.control(this.dateTimeUtil.getCurrentDateModel(), null),      
      tpFromTime: this.formBuilder.control(this.dateTimeUtil.getCurrentTimeModel(), Validators.required),
      tpToTime: this.formBuilder.control(this.dateTimeUtil.getCurrentTimeModel(), Validators.required),
      chkisLoginFail: this.formBuilder.control(false, Validators.required)
    })
  }
  getPHRLoginLog  () {
    this.onSearchClick(this.filterForm.value);
    // this.phrService.getPHRLoginLog(this.lookupList.practiceInfo.practiceId.toString(), this.lookupList.patientInfo.patient_id).subscribe(
    //   data => {
    //     this.lstLoginLogDB =  data as Array<any>;
    //     this.search();
       
    //     this.isLoading = false;
    //   },
    //   error => {
    //     this.logMessage.log("getPHRLoginLog " + error);
    //     this.isLoading = false;
    //   }
    // );
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
    reportSearchCriteria.param_list.push({ name: "action_type", value: (formData.chkisLoginFail==false?"success":"failed"), option: "" });
    
    this.phrService.getPHRLoginLog(reportSearchCriteria).subscribe(
      data => {
        this.isLoading=false;
        //this.lstEncounter = data;
        //this.lstActivityLog =  data as Array<any>;
        this.lstLoginLogDB=  data as Array<any>;
        this.search();
        this.isLoading = false;
      },
      error => {
        this.logMessage.log("getPHREncounterSummary " + error);
        this.isLoading = false;
      }
    );
  }

  selectClickedRow(value){
    this.selectedRowID = value.logid;
  }
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  sortEvent: SortEvent;

  onSort(sortEvent: SortEvent) {
    this.sortEvent = sortEvent;
    this.search();
  }

  private search() {

    let sortFilterPaginationResult: SortFilterPaginationResult = this.sortFilterPaginationService.search(this.lstLoginLogDB, this.headers, this.sortEvent, null, null, '');
    debugger;
    this.lstLoginLog = sortFilterPaginationResult.list;
    if(this.lstLoginLog !=null && this.lstLoginLog.length >0)
    {
      this.selectClickedRow(this.lstLoginLog[0]);
    }
  }
}
