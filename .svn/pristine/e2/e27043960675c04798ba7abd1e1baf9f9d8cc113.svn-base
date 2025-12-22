import { NgModule, InjectionToken } from '@angular/core';
import { LogedInUser } from './loged-in-user';
import { PracticeInfo } from './practice-info';
import { InsuranceInformation } from './insurance';


export let LOOKUP_LIST = new InjectionToken<LookupList>('app.config');

export class LookupList {
  isPhrDataLoad: boolean;
  practiceInfo: PracticeInfo;
  logedInUser: LogedInUser;
  patientInfo: any;
  providerList: Array<any>;
  lstdocumentPath: Array<any>;
  is_AuthUser:boolean;
  patientVitals: any;
  defaultPatPic:string;
  defaultPatMalePic:string;
  defaultPatFemalePic:string;
  patientAllergies: any;
  patientMedication: any;
  PatientProblems: any;
  lstUserChartModuleSetting:Array<any>;
  loginLogID: any;
  insuranceInfo: InsuranceInformation;
}

export const LookupListData: LookupList = {
  isPhrDataLoad: false,
  practiceInfo: new PracticeInfo(),
  logedInUser: new LogedInUser(),
  patientInfo: undefined,
  providerList: new Array(),
  lstdocumentPath: new Array(),
  is_AuthUser:false,
  patientVitals:undefined,
  patientAllergies:undefined,
  patientMedication:undefined,
  PatientProblems:undefined,
  lstUserChartModuleSetting:new Array(),
  loginLogID: undefined,
  insuranceInfo: new InsuranceInformation(),
  defaultPatPic:"assets/images/pic.png",
  defaultPatMalePic:"assets/images/img_male.png",
  defaultPatFemalePic:"assets/images/img_female.png"
};

@NgModule({
  providers: [{
    provide: LOOKUP_LIST,
    useValue: LookupListData,

  }]
})
export class LookupListModule { }