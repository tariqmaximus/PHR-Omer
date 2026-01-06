import { Injectable, Inject } from "@angular/core";
import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { APP_CONFIG, AppConfig } from "src/app/providers/app-config.module";
import { SearchCriteria } from "src/app/models/common/search-criteria";
import { ORMDeleteRecord } from "src/app/models/general/orm-delete-record";
import { ORMPHRAuditLog } from "src/app/models/audit/ORMPHRAuditLog";
import { ORMPHRLoginuser } from "src/app/models/general/ORMPHRLoginuser";
import { ChangePasswordModel } from "src/app/models/change-password-model";
import { ORMKeyValue } from "src/app/models/general/orm-key-value";
import { UpdateRecordModel } from "src/app/models/update-record-model";

@Injectable({
    providedIn: 'root'
})
export class PhrService {

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient,
    @Inject(APP_CONFIG) private config: AppConfig) { }


  updatePHRLog(obj: ORMPHRAuditLog) {
    return this.http.post(this.config.apiEndpoint + 'phr/updatePHRLog', obj, this.httpOptions);
  }
  updateLoginInformation(obj: ORMPHRLoginuser) {
    return this.http.post(this.config.apiEndpoint + 'phr/updateLoginInformation', obj, this.httpOptions);
  }
  updatePHRLogout(searchCriteria: SearchCriteria) {
    return this.http.post(this.config.apiEndpoint + 'phr/updatePHRLogout', searchCriteria, this.httpOptions);
  }
  getPHRLogedInUserDetail(userId: number) {
    return this.http
      .get(this.config.apiEndpoint + 'phr/getPHRLogedInUserDetail/' + userId, this.httpOptions);
  }
  getPatientInfo(patientId: number) {

    let queryParams = new HttpParams();
    queryParams = queryParams.append("patient_id", patientId.toString());

    return this.http.get(
      this.config.apiEndpoint + 'phr/getPatientInfo', { ...this.httpOptions, params: queryParams });
  }

  getMessagesCount(user_id: String) {
    return this.http.post(
      this.config.apiEndpoint + 'phr/getMessagesCount/' + user_id, this.httpOptions);
  }
  getMessageslist(patient_id: String, mes_type: string) {

    let queryParams = new HttpParams();
    queryParams = queryParams.append("patient_id", patient_id.toString());
    queryParams = queryParams.append("message_type", mes_type.toString());

    return this.http.get(
      this.config.apiEndpoint + 'phr/getMessagesList', { ...this.httpOptions, params: queryParams });

  }
  // getProvider(practice_id: number) {
  //   return this.http.get(
  //     this.config.apiEndpoint + 'phr/getProviderList/' + practice_id, this.httpOptions);
  // }

  SavePatientMessage(formData: FormData) {
    return this.http.post(this.config.apiEndpoint + 'phr/savePatientMessage', formData);
  }

  getPatientMessageDetail(patientId: number, messageId: number) {
    debugger;
    return this.http.post(
      this.config.apiEndpoint + 'phr/getPatientMessageDetail/' + patientId + '/' + messageId, this.httpOptions);
  }
  markMessageAsRead(lstKV: Array<ORMKeyValue>) {
    return this.http.post(this.config.apiEndpoint + 'phr/marAsRead', lstKV, this.httpOptions);
  }

  getPatientMsgAttachments(patientId: number, message_ID: number) {
    return this.http.get(this.config.apiEndpoint + 'phr/getPatientMsgAttachments/' + patientId + '/' + message_ID, this.httpOptions);
  }
  downloadFile(file_name: SearchCriteria) {
    return this.http.post(
      this.config.apiEndpoint + 'phr/downloadB', file_name, { responseType: 'arraybuffer' });
  }
  deleteSelectedAttachment(obj: ORMDeleteRecord) {
    return this.http.post(this.config.apiEndpoint + 'phr/deleteSelectedAttachment', obj, this.httpOptions);
  }
  getPHRActivityLog(search: SearchCriteria) {
    return this.http.post(this.config.apiEndpoint + 'phr/getPHRActivityLog', search);
  }

  getPHRLoginLog(search: SearchCriteria) {
    return this.http.post(this.config.apiEndpoint + 'phr/getPHRLoginLog', search);
  }
  getPatientPHRLabOrderSummary(patient_id: String) {
    return this.http.post(this.config.apiEndpoint + 'phr/getPatientPHRLabOrderSummary/' + patient_id, this.httpOptions);
  }
  getSelectedPHRLabOrderResult(orderID: String) {
    return this.http.post(this.config.apiEndpoint + 'phr/getSelectedPHRLabOrderResult/' + orderID, this.httpOptions);
  }
  getLabAttachments(orderID: String) {
    return this.http.post(this.config.apiEndpoint + 'phr/getLabAttachments/' + orderID, this.httpOptions);
  }

  getLabResultRptHeader(Order_ID: string) {
    return this.http.get(this.config.apiEndpoint + 'phr/getLabResultRptHeader/' + Order_ID, this.httpOptions);
  }
  getLabRptOrderTest(Order_ID: string) {
    return this.http.get(this.config.apiEndpoint + 'phr/getLabRptOrderTest/' + Order_ID, this.httpOptions);
  }
  getLabRptOrderResult(Order_ID: string) {
    return this.http.get(this.config.apiEndpoint + 'phr/getLabRptOrderResult/' + Order_ID, this.httpOptions);
  }

  getLabRptOrderDir(Order_ID: string) {
    return this.http.get(this.config.apiEndpoint + 'phr/getLabRptOrderDir/' + Order_ID, this.httpOptions);
  }
  getLabRptOrderSourceVolume(Order_ID: string) {
    return this.http.get(this.config.apiEndpoint + 'phr/getLabRptOrderSourceVolume/' + Order_ID, this.httpOptions);
  }

  getGynMain(patient_id: String) {
    return this.http.post(this.config.apiEndpoint + 'phr/getGynMain/' + patient_id, this.httpOptions);
  }
  changePassword(changePasswordModel: ChangePasswordModel) {
    return this.http.post(this.config.apiEndpoint + 'phr/changePassword', changePasswordModel, this.httpOptions);
  }
  getAmendmentRequest(searchCriteria: SearchCriteria) {
    return this.http.post(this.config.apiEndpoint + 'phr/getAmendmentRequest', searchCriteria, this.httpOptions);
  }

  deletePatMsg(searchCriteria: SearchCriteria) {
    return this.http.post(this.config.apiEndpoint + 'phr/deletePatMsg', searchCriteria, this.httpOptions);
  }

  GetPatientAuthorizedClientsUserDetail(patient_id: number) {

    debugger;
    let queryParams = new HttpParams();
    queryParams = queryParams.append("patient_id", patient_id.toString());
    return this.http.get(
      this.config.apiEndpoint + 'smartFhir/GetPatientAuthorizedClientsUserDetail', { ...this.httpOptions, params: queryParams });

  }
  RevokePatientAuthorizedClientAccess(obj: UpdateRecordModel) {
    return this.http.post(this.config.apiEndpoint + 'smartFhir/RevokePatientAuthorizedClientAccess', obj, this.httpOptions);
  }
}