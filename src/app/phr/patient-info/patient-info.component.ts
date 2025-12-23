import { Component, OnInit, Inject } from '@angular/core';
import { LookupList, LOOKUP_LIST } from 'src/app/providers/lookupList.module';

@Component({
    selector: 'patient-info',
    templateUrl: './patient-info.component.html',
    styleUrls: ['./patient-info.component.css'],
    standalone: false
})
export class PatientInfoComponent implements OnInit {
  patient_Name;
  patient_maritalStatus;
  patient_pid;
  patient_dob;
  patient_contactNumber;
  patient_Address;
  patient_City;
  patient_State;
  patient_Zip;
  patient_age_yy;
  patient_age_mm;
  patient_age_dd;
  patient_weight;
  patient_height;
  patietn_bmi;
  patietn_temp;
  patietn_bp;
  patPicURL: String;
  downloadPath;
  patient_gender;

  constructor(@Inject(LOOKUP_LIST) public lookupList: LookupList) { }

  ngOnInit() {
    if (this.lookupList.lstdocumentPath != undefined && this.lookupList.lstdocumentPath.length > 0) {
      this.downloadPath = this.lookupList.lstdocumentPath[0].download_path;
    }
    this.getPatientContent()
  }
  getPatientContent() {
    debugger;
    //this.patPicURL = this.lookupList.patientInfo.pic;
    if (this.lookupList.patientInfo.pic == null || this.lookupList.patientInfo.pic == undefined || this.lookupList.patientInfo.pic == '') {

      if (this.lookupList.patientInfo.gender_code == 'M') {
        this.patPicURL = this.lookupList.defaultPatMalePic;// "assets/images/img_male.png"        
      }
      else if (this.lookupList.patientInfo.gender_code == 'F') {
        this.patPicURL = this.lookupList.defaultPatFemalePic;//"assets/images/img_female.png"        
      }
      else {
        this.patPicURL = this.lookupList.defaultPatPic;
      }
    }
    else {
      this.patPicURL = this.downloadPath + this.lookupList.practiceInfo.practiceId + "/" + "PatientImages/" + this.lookupList.patientInfo.pic;
    }

    if (this.lookupList.patientInfo.gender_code == 'M') {
      this.patient_gender = "MALE";
    } else if (this.lookupList.patientInfo.gender_code == 'F') {
      this.patient_gender = "FEMALE";
    }

    this.patient_Name = this.lookupList.patientInfo.last_name + ", " + this.lookupList.patientInfo.first_name;
    this.patient_maritalStatus = this.lookupList.patientInfo.marital_status;
    this.patient_pid = this.lookupList.patientInfo.pid;
    this.patient_dob = this.lookupList.patientInfo.dob;
    this.patient_contactNumber = this.lookupList.patientInfo.primary_contact_no;
    this.patient_Address = this.lookupList.patientInfo.address;
    this.patient_City = this.lookupList.patientInfo.city;
    this.patient_State = this.lookupList.patientInfo.state;
    this.patient_Zip = this.lookupList.patientInfo.zip;
    this.patient_age_yy = this.lookupList.patientInfo.age_year;
    this.patient_age_mm = this.lookupList.patientInfo.age_month;
    this.patient_age_dd = this.lookupList.patientInfo.age_days;

    this.patient_weight = this.lookupList.patientVitals.weight;
    this.patient_height = this.lookupList.patientVitals.height;
    this.patietn_bmi = this.lookupList.patientVitals.bmi;
    this.patietn_temp = this.lookupList.patientVitals.temprature;
    this.patietn_bp = this.lookupList.patientVitals.bp;
  }

  patPicErrorHandler(event) {
    event.target.src = this.lookupList.defaultPatPic;
  }
}
