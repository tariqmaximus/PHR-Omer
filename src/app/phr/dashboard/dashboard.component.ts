import { Component, OnInit, Inject } from '@angular/core';
import { LookupList, LOOKUP_LIST } from 'src/app/providers/lookupList.module';
import { GeneralOperation } from 'src/app/shared/generalOperation';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    standalone: false
})
export class DashboardComponent implements OnInit {
  patientName:string='';
  pat_age:string='';
  pat_gender:string='';
  pat_dob:string='';
  patient_address:string='';
  patient_city:string='';
  patient_state:string='';
  patient_zip:string='';
  pat_weight:string='';
  pat_bmi:string='';
  pat_height:string='';
  pat_BP:string='';
  pat_BP2:string='';
  pulse:string='';
  pat_oxy_sat:string='';
  bodyTemp:string='';
  

  info_practice_name:string='';
  info_practice_address:string='';
  info_practice_contact:string='';
  primar_ins;
  secondary_ins;
  patPicURL: String;
  downloadPath:string='';
  constructor(@Inject(LOOKUP_LIST) public lookupList: LookupList,
  private GeneralOperation: GeneralOperation) { }

  ngOnInit() {
    if (this.lookupList.lstdocumentPath != undefined && this.lookupList.lstdocumentPath.length > 0) {
      this.downloadPath = this.lookupList.lstdocumentPath[0].download_path;
    }
    this.assignValuesToHeader();
    this.assignValuesToPractice();
    this.GeneralOperation.updateLog("Profile", this.lookupList.patientInfo.patient_id, "View","");
  }
  patPicErrorHandler(event) {
    event.target.src = this.lookupList.defaultPatPic;;
  }
  assignValuesToHeader() {
    debugger;
    this.patientName = this.lookupList.patientInfo.last_name + ", " + this.lookupList.patientInfo.first_name;
    this.pat_age = this.lookupList.patientInfo.age_year + "y " + this.lookupList.patientInfo.age_month + "m " + this.lookupList.patientInfo.age_days + "d";
    if (this.lookupList.patientInfo.gender_code == 'M') {
      this.pat_gender = "MALE";
      if(this.lookupList.patientInfo.pic !=""){
        this.patPicURL = this.downloadPath + this.lookupList.practiceInfo.practiceId + "/" + "PatientImages/" + this.lookupList.patientInfo.pic;
      }else{
        this.patPicURL = this.lookupList.defaultPatMalePic;
      }
    } else if (this.lookupList.patientInfo.gender_code == 'F') {
      this.pat_gender = "FEMALE";
      if(this.lookupList.patientInfo.pic !=""){
        this.patPicURL = this.downloadPath + this.lookupList.practiceInfo.practiceId + "/" + "PatientImages/" + this.lookupList.patientInfo.pic;
      }else{
        this.patPicURL = this.lookupList.defaultPatFemalePic;
      }
    }
    this.pat_dob = this.lookupList.patientInfo.dob;
    this.patient_address = this.lookupList.patientInfo.address;
    this.patient_city = this.lookupList.patientInfo.city;
    this.patient_state = this.lookupList.patientInfo.state;
    this.patient_zip = this.lookupList.patientInfo.zip;

      
if(this.lookupList.patientVitals != null || this.lookupList.patientVitals != undefined){
  this.pat_weight = this.lookupList.patientVitals.weight == undefined ? "": this.lookupList.patientVitals.weight;
  this.pat_bmi = this.lookupList.patientVitals.bmi;
  this.pat_height = this.lookupList.patientVitals.height;
  this.pat_BP = this.lookupList.patientVitals.bp;
  this.pat_BP2 = this.lookupList.patientVitals.bp2;
  this.pulse = this.lookupList.patientVitals.pulse;
  this.bodyTemp = this.lookupList.patientVitals.temprature;
}else{
  this.pat_weight = "";
  this.pat_bmi = "";
  this.pat_height = "";
  this.pat_BP = "";
  this.pat_BP2 = "";
  this.pulse = "";
  this.bodyTemp = "";
}
    
//defaultPatFemalePic

    //    this.pat_oxy_sat = this.lookupList.patientVitals.weight;
  }
  assignValuesToPractice() {
    debugger;
    this.info_practice_name = this.lookupList.practiceInfo.practiceName;
    this.info_practice_address = this.lookupList.practiceInfo.address1 + " " + this.lookupList.practiceInfo.zip + " " + this.lookupList.practiceInfo.city + " " + this.lookupList.practiceInfo.state;
    this.info_practice_contact = this.lookupList.practiceInfo.phone;
    this.primar_ins = this.lookupList.insuranceInfo.primary;
    this.secondary_ins = this.lookupList.insuranceInfo.secondary;
  }
}
