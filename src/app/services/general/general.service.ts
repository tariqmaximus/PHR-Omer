import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthenticationCredentials } from 'src/app/authentication/authenticationCredentials';
import { AppConfig, APP_CONFIG } from 'src/app/providers/app-config.module';
import { SearchCriteria } from 'src/app/models/common/search-criteria';
import { ORMDeleteRecord } from 'src/app/models/general/orm-delete-record';
import { GenerateResetPasswordLinkModel } from 'src/app/models/generate-reset-password-link-model';
import { ChangePasswordModel } from 'src/app/models/change-password-model';

@Injectable({
    providedIn: 'root'
})
export class GeneralService {
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient,
    @Inject(APP_CONFIG) private config: AppConfig) { }

  printReport(printContents: string) {
    let popupWin;
    // printContents = document.getElementById('report').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,right=10,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
        <html>
          <head>
            <title>Print tab</title>          
            <link rel="stylesheet" type="text/css" href="./assets/css/bootstrap.min.css" media="screen,print">  
            <link rel="stylesheet" type="text/css" href="./assets/css/fontawesome.min.css" media="screen,print"/>          
            <link rel="stylesheet" type="text/css" href="./assets/css/report-print.css" media="screen,print"/>                     
            <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900" rel="stylesheet">              
          </head>
      <body style="background-color:white; font-size:110%" onload="window.print();">${printContents}</body>
        </html>`
    );
    popupWin.document.close();
  }


  printReportWithStyle(printContents: string, style: string) {
    let popupWin;
    popupWin = window.open('', '_blank', 'top=10,left=10,right=10,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
        <html>
          <head>
            <title>Print tab</title>          
            <link rel="stylesheet" type="text/css" href="./assets/css/bootstrap.min.css" media="screen,print">  
            <link rel="stylesheet" type="text/css" href="./assets/css/fontawesome.min.css" media="screen,print"/>          
            <link rel="stylesheet" type="text/css" href="./assets/css/report-print.css" media="screen,print"/>                     
            <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900" rel="stylesheet">              
          </head>`+
      ' <style> ' + style + '</style>' +
      `<body style="background-color:white; font-size:110%" onload="window.print();">${printContents}</body>
        </html>`
    );
    popupWin.document.close();

  }

  getAccessToken(auth: AuthenticationCredentials) {
    const url = this.config.authServiceEndpoint + '/CustomAccount/LoginPhr';
    console.log('Login URL:', url);
    return this.http
      .post(url, auth);
  }

  GenerateResetPasswordLink(obj: GenerateResetPasswordLinkModel) {
    return this.http
      .post(this.config.authServiceEndpoint + '/CustomAccount/GenerateResetPasswordLink', obj);
  }

  ResetPasswordByToken(obj: ChangePasswordModel, resetToken: string) {

    debugger;
    const options = {
      headers: new HttpHeaders({ 'Authorization': ("Bearer " + resetToken) })
    };

    return this.http
      .post(this.config.authServiceEndpoint + '/CustomAccount/ResetPasswordByToken', obj, options);
  }

  getProvider(practice_id: number) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("practice_id", practice_id.toString());

    return this.http.get(
      this.config.apiEndpoint + 'lookup/getProviderList', { ...this.httpOptions, params: queryParams });
  }

  getDocCategories(practice_id: number) {
    return this.http.get(
      this.config.apiEndpoint + 'general/getDocCategories/' + practice_id, this.httpOptions);
  }
  getDocCategoriesList(practice_id: number) {
    return this.http.get(
      this.config.apiEndpoint + 'general/getDocCategoriesList/' + practice_id, this.httpOptions);
  }
  getDocumentPaths() {
    return this.http.get(
      this.config.apiEndpoint + 'docs/getDocumentPaths', this.httpOptions);
  }
  getPatientHeader(patientId) {
    return this.http.get(this.config.apiEndpoint + 'general/getPatientHeader/' + patientId, this.httpOptions);
  }
  getPatientVitals(patientId) {
    return this.http.get(this.config.apiEndpoint + 'general/getPatientVitalsPHR/' + patientId, this.httpOptions);
  }
  getPracticeInfo(practiceId: number) {

    let queryParams = new HttpParams();
    queryParams = queryParams.append("practice_id", practiceId.toString());

    return this.http.get(
      this.config.apiEndpoint + 'general/getPracticeInfo', { ...this.httpOptions, params: queryParams });
  }
  getPatientAllergies(patientId: number) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("patient_id", patientId.toString());

    return this.http.get(
      this.config.apiEndpoint + 'patient-summary/getallergiesummary', { ...this.httpOptions, params: queryParams });
  }
  getPatientMedicationSummary(patientId: number) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("patient_id", patientId.toString());

    return this.http.get(
      this.config.apiEndpoint + 'patient-summary/getmedicationsummary', { ...this.httpOptions, params: queryParams });
  }
  getPatientProblems(patientId: number) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("patient_id", patientId.toString());

    return this.http.get(
      this.config.apiEndpoint + 'patient-summary/getproblemsummary', { ...this.httpOptions, params: queryParams });
  }
  getPHREncounterSummary1(patientId: number) {
    return this.http.get(this.config.apiEndpoint + 'general/getPHREncounterSummary/' + patientId, this.httpOptions);
  }
  getPHREncounterSummary(criteria: SearchCriteria) {
    return this.http.post(this.config.apiEndpoint + 'general/getPHREncounterSummary', criteria);
  }
  getReportHeader(chartID: string) {
    return this.http.get(this.config.apiEndpoint + 'general/getReportHeader/' + chartID, this.httpOptions);
  }
  getInsuranceDetails(patientId) {
    return this.http.get(this.config.apiEndpoint + 'general/getInsuranceDetails/' + patientId, this.httpOptions);
  }
  downloadFile(file_name: SearchCriteria) {
    return this.http.post(
      this.config.apiEndpoint + 'general/downloadB', file_name, { responseType: 'arraybuffer' });
  }
  sendEmailpdf(formData: FormData) {
    return this.http.post(this.config.apiEndpoint + 'general/sendEmailpdf', formData);
  }
  saveHealthInfo(formData: FormData) {
    return this.http.post(this.config.apiEndpoint + 'patient/AddEditNewHealthInformation', formData);
  }
  getPatientHealthInfo(patientId, practice_id) {
    return this.http.get(this.config.apiEndpoint + 'patient/getHealthInfoCapture/' + patientId + '/' + practice_id, this.httpOptions);
  }

  getHealthInfoCaptureAttach(obj: SearchCriteria) {
    return this.http
      .post(this.config.apiEndpoint + 'patient/getHealthInfoCaptureAttach', obj);
  }
  getHealthInfoCaptureLinks(obj: SearchCriteria) {
    return this.http
      .post(this.config.apiEndpoint + 'patient/getHealthInfoCaptureLinks', obj);
  }
  deleteInfoCapture(obj: ORMDeleteRecord) {
    return this.http.post(this.config.apiEndpoint + 'patient/deleteInfoCapture', obj, this.httpOptions);
  }
  deleteInfoAttachments(obj: ORMDeleteRecord) {
    return this.http.post(this.config.apiEndpoint + 'patient/deleteInfoAttachments', obj, this.httpOptions);
  }

  sendDirectMessage(formData: FormData) {
    return this.http.post(this.config.apiEndpoint + 'direct/sendDirectMessage', formData);
  }
}
