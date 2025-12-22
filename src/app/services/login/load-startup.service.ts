import { log } from 'util';
import { GeneralService } from './../general/general.service';
import { LOOKUP_LIST, LookupList } from './../../providers/lookupList.module';
import { Injectable, Inject } from '@angular/core';
import { LogMessage } from '../../shared/log-message';
import { ORMLoginVerify } from 'src/app/models/general/ORMLoginVerify';

@Injectable()
export class LoadStartupService {
  waitForLogin = 0;
  constructor(@Inject(LOOKUP_LIST) public lookupList: LookupList,
    private generalService: GeneralService, private logMessage: LogMessage) {

  }

  loadAppData() {
    this.waitForLogin = 8;

    this.getPracticeInfo();
    this.getPatientAllergies();
    this.getDocumentPath();
    this.getProvider();
    this.getInsuranceDetails();
    //this.getPatientHeader();
    this.getPatientVitals();
    this.getPatientProblems();
    this.getPatientMedicationSummary();
  }


  getPatientProblems() {

    this.generalService.getPatientProblems(this.lookupList.patientInfo.patient_id).subscribe(
      data => {
        this.onPatientProblemsSuccessfull(data);
      },
      error => {
        this.onPatientProblemsError(error);
      }
    );
  }
  onPatientProblemsSuccessfull(data) {
    if (data.length > 0) {
      this.lookupList.PatientProblems = data;
      //this.waitForLogin--;
      this.isDataLoadCompleted();
    } else {
      this.lookupList.PatientProblems = null;
      this.isDataLoadCompleted();
    }
  }

  onPatientProblemsError(error) {
    this.lookupList.PatientProblems = null;
    this.isDataLoadCompleted();
    this.logMessage.log("getPatientProblems Error.");
  }


  getPatientMedicationSummary() {

    this.generalService.getPatientMedicationSummary(this.lookupList.patientInfo.patient_id).subscribe(
      data => {
        this.onPatientMedicationSuccessfull(data);
      },
      error => {
        this.onPatientMedicationSummaryError(error);
      }
    );
  }
  onPatientMedicationSuccessfull(data) {
    debugger;
    if (data.length > 0) {
      this.lookupList.patientMedication = data;
      //this.waitForLogin--;
      this.isDataLoadCompleted();
    } else {
      this.lookupList.patientMedication = null;
      this.isDataLoadCompleted();
    }
  }

  onPatientMedicationSummaryError(error) {
    this.lookupList.patientMedication = null;
    this.isDataLoadCompleted();
    this.logMessage.log("onPatientMedicationSummaryError Error.");
  }
  // getPatientHeader(){
  //     this.generalService.getPatientHeader(this.lookupList.patientInfo.patientId).subscribe(
  //       data => {
  //         this.onHeaderSuccessfull(data);
  //       },
  //       error => {
  //         this.onHeaderError(error);
  //       }
  //     );
  // }

  // onHeaderError(error) {
  //   this.logMessage.log("onHeaderError Error.");
  // }
  getInsuranceDetails() {

    this.generalService.getInsuranceDetails(this.lookupList.patientInfo.patient_id).subscribe(
      data => {
        this.onGetInsuranceDetailsSuccessfull(data);
      },
      error => {
        this.onGetInsuranceDetailsError(error);
      }
    );
  }
  onGetInsuranceDetailsError(error) {
    this.isDataLoadCompleted();
    this.logMessage.log("getInsuranceDetails Error.");
  }
  onGetInsuranceDetailsSuccessfull(data) {
    if (data != undefined || data != null) {
      this.lookupList.insuranceInfo.primary = data[0].col1;
      this.lookupList.insuranceInfo.secondary = data.length > 1 ? data[1].col1 : "";

      //this.waitForLogin--;
      this.isDataLoadCompleted();
    } else {
      this.lookupList.insuranceInfo.primary = "";
      this.lookupList.insuranceInfo.secondary = "";
      this.isDataLoadCompleted();
    }
  }
  getPatientVitals() {

    this.generalService.getPatientVitals(this.lookupList.patientInfo.patient_id).subscribe(
      data => {
        this.onHeaderVitalsSuccessfull(data);
      },
      error => {
        this.onHeaderVitalsError(error);
      }
    );
  }
  onHeaderVitalsSuccessfull(data) {

    if (data != undefined || data != null) {
      this.lookupList.patientVitals = data;
      //this.waitForLogin--;
      this.isDataLoadCompleted();
      //this.patWeight = data["weight"];
      // this.patHeight = data["height"];

      // this.patBMI = data["bmi"];
      //this.patBP = data["bp"];
      //this.patTemp = data["temprature"];
    } else {
      this.lookupList.patientVitals = null;
      this.isDataLoadCompleted();
    }
  }
  onHeaderVitalsError(error) {
    this.lookupList.patientVitals = null;
    this.isDataLoadCompleted();
    this.logMessage.log("onHeaderVitalsError Error.");
  }
  isDataLoadCompleted() {
    this.waitForLogin--;
    //Login Success 

    if (this.waitForLogin == 0)
      this.lookupList.isPhrDataLoad = true;
  }
  getPracticeInfo() {
    debugger;
    this.generalService.getPracticeInfo(this.lookupList.patientInfo.practice_id).subscribe(
      data => {
        if (data != null && data != undefined) {
          this.lookupList.practiceInfo.practiceId = data['practice_id'];
          this.lookupList.practiceInfo.practiceName = data['practice_name'];
          this.lookupList.practiceInfo.address1 = data['address1'];
          this.lookupList.practiceInfo.address2 = data['address2'];
          this.lookupList.practiceInfo.city = data['city'];
          this.lookupList.practiceInfo.state = data['state'];
          this.lookupList.practiceInfo.zip = data['zip'];
          this.lookupList.practiceInfo.phone = data['phone'];
          this.lookupList.practiceInfo.fax = data['fax'];
          this.lookupList.practiceInfo.domain = data['domain_name'];
          //this.waitForLogin--;
          this.isDataLoadCompleted();
        } else {
          this.isDataLoadCompleted();
        }


      },
      error => {
        this.isDataLoadCompleted();
        this.logMessage.log("getPracticeInfo: " + error);
      }
    );
  }
  getProvider() {
    //Load Provider

    this.generalService.getProvider(this.lookupList.patientInfo.practice_id).subscribe(

      data => {
        this.lookupList.providerList = data as Array<any>;
        //this.waitForLogin--;
        this.isDataLoadCompleted();
      },
      error => {
        this.lookupList.providerList = null;
        this.isDataLoadCompleted();
        this.logMessage.log("getProvider: " + error);
      }
    );
  }

  getDocumentPath() {
    //getDocumentPaths
    debugger;
    this.generalService.getDocumentPaths().subscribe(
      data => {
        this.lookupList.lstdocumentPath = data as Array<any>;
        //this.waitForLogin--;
        this.isDataLoadCompleted();
      },
      error => {
        this.lookupList.lstdocumentPath = null;
        this.isDataLoadCompleted();
        this.logMessage.log("getDocumentPath:" + error);
      }
    );
  }
  getPatientAllergies() {

    this.generalService.getPatientAllergies(this.lookupList.patientInfo.patient_id).subscribe(
      data => {
        this.lookupList.patientAllergies = data as Array<any>;
        //this.waitForLogin--;
        this.isDataLoadCompleted();
      },
      error => {
        this.lookupList.patientAllergies = null;
        this.isDataLoadCompleted();
        this.logMessage.log("getAllergies: " + error);
      }
    );
  }
}
