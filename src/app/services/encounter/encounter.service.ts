
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { SearchCriteria } from "../../models/common/search-criteria";
import { APP_CONFIG, AppConfig } from '../../providers/app-config.module';
import { GetPrescriptionAllergies } from 'src/app/models/encounter/GetPrescriptionAllergies';
import { ORMCCDRequest } from 'src/app/models/charts/ORMCCDRequest';

@Injectable({
    providedIn: 'root'
})
export class EncounterService {
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private http: HttpClient,
    @Inject(APP_CONFIG) private config: AppConfig) {
  }

  getChartReasonForVisit_HPI(chartID: String) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getChartReasonForVisit_HPI/' + chartID, this.httpOptions);
  }
  getChartVital(chartID: number) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getChartVital/' + chartID, this.httpOptions);
  }
  getChartProblem(searchCriteria: SearchCriteria) {
    return this.http.post(this.config.apiEndpoint + 'encounter/getChartProblem', searchCriteria, this.httpOptions);
  }
  getChartProcedures(chartID: string) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getChartProcedures/' + chartID, this.httpOptions);
  }
  getChartImmunizationSummary(searchCriteria: SearchCriteria) {
    return this.http.post(this.config.apiEndpoint + 'encounter/getChartImmunizationSummary', searchCriteria, this.httpOptions);
  }
  getChartSocialHistDetailById(SocialhistoryId: number) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getChartSocialHistDetailById/' + SocialhistoryId, this.httpOptions);
  }
  getChartFamilyHis(criteria: SearchCriteria) {
    return this.http.post(this.config.apiEndpoint + 'encounter/getChartFamilyHis', criteria, this.httpOptions);
  }
  getPatPrescription(criteria: SearchCriteria) {
    return this.http.post(this.config.apiEndpoint + 'prescription-allergy/getPatPrescription', criteria, this.httpOptions);
  }
  getPatAllergies(criteria: SearchCriteria) {
    return this.http.post(this.config.apiEndpoint + 'prescription-allergy/getPatAllergies', criteria, this.httpOptions);
  }

  getPatProgressNotes(chartID: string) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getChartProgressNotes/' + chartID, this.httpOptions);
  }
  getPatAnnotation(chartID: string) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getChartAnnotation/' + chartID, this.httpOptions);
  }
  getPatCarePlan(chartID: string) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getPatCarePlan/' + chartID, this.httpOptions);
  }
  getPatCognitive(chartID: string) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getChartCognitiveFunctional/' + chartID, this.httpOptions);
  }

  getChartROS(ChartId: string) {

    let queryParams = new HttpParams();
    queryParams = queryParams.append("chart_id", ChartId.toString());

    return this.http.get(
      this.config.apiEndpoint + 'encounter/getChartROS', { ...this.httpOptions, params: queryParams });
  }

  getChartPhysicalExam(ChartId: number) {

    let queryParams = new HttpParams();
    queryParams = queryParams.append("chart_id", ChartId.toString());

    return this.http.get(
      this.config.apiEndpoint + 'encounter/getChartPhysicalExam', { ...this.httpOptions, params: queryParams });
  }

  getPatInjuryNotes(patientid: string, chartID: string) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getPatInjuryNotes/' + patientid + '/' + chartID, this.httpOptions);
  }
  getChartFollowUpProblem(chartID: string) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getChartFollowUpProblem/' + chartID, this.httpOptions);
  }
  getPastMedHistory(chartID: string) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getPastMedHistory/' + chartID, this.httpOptions);
  }
  getAssessments(chartID: string) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getAssessments/' + chartID, this.httpOptions);
  }
  getPatient_AWVPrint(patientId: string, chartID: string) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getPatientAWVPrint/' + patientId + '/' + chartID, this.httpOptions);
  }
  getHealthMaint_Print(patientId: string, chartID: string) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getHealthMaintPrint/' + patientId + '/' + chartID, this.httpOptions);
  }
  getLabOrderTest_Print(chartID: string) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getLabOrderTestPrint/' + chartID, this.httpOptions);
  }
  getOfficeTestPrint(chartID: string) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getOfficeTest/' + chartID, this.httpOptions);
  }
  getAmendments_Print(chartID: string) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getAmendmentsPrint/' + chartID, this.httpOptions);
  }
  getChartReportDetails(chartID: string) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getChartReportDetails/' + chartID, this.httpOptions);
  }

  getChartSummary(patient_id: String) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getChartSummary/' + patient_id, this.httpOptions);
  }
  getAppointmentDates(patient_id: String) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getAppointmentDates/' + patient_id, this.httpOptions);
  }

  getChartSocialHistDisplay(chartID: number) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getChartSocialHistDisplay/' + chartID, this.httpOptions);
  }
  getChartAnnotation(chartID: String) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getChartAnnotation/' + chartID, this.httpOptions);
  }

  getCognitiveValues(chart_id: String) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getCognitiveValues/' + chart_id, this.httpOptions);
  }

  getChartCognitiveFunctional(chart_id: String) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getChartCognitiveFunctional/' + chart_id, this.httpOptions);
  }

  GetPhyCare(practice_id: String, patient_id: String, chart_id: String) {
    return this.http.get(this.config.apiEndpoint + 'encounter/GetPhyCare/' + practice_id + '/' + patient_id + '/' + chart_id, this.httpOptions);
  }

  getPatientVisitSnapShot(searchCriteria: SearchCriteria) {
    return this.http.post(this.config.apiEndpoint + 'encounter/getPatientVisitSnapShot', searchCriteria, this.httpOptions);
  }

  getFutureAppointments(patientId: string, chartID: string) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getFutureAppointments/' + patientId + '/' + chartID, this.httpOptions);
  }

  getPatientHealthCheckSummary(searchobj: SearchCriteria) {
    return this.http.post(this.config.apiEndpoint + 'encounter/getPatientHealthCheckSummary', searchobj, this.httpOptions);
  }
  getHealthCheckFormsList(searchobj: SearchCriteria) {
    return this.http.post(this.config.apiEndpoint + 'encounter/getHealthCheckFormsList', searchobj, this.httpOptions);
  }
  getHealthCheckFormFromId(searchobj: SearchCriteria) {
    return this.http.post(this.config.apiEndpoint + 'encounter/getHealthCheckFormFromId', searchobj, this.httpOptions);
  }

  getPatientHealthCheckForm(searchcrit: SearchCriteria) {
    return this.http.post(this.config.apiEndpoint + 'encounter/getPatientHealthCheckForm', searchcrit, this.httpOptions);
  }
  getChartModuleHistCriteria(query: String) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getChartModuleHistCriteria/' + query, this.httpOptions);
  }

  getCummulativeVitals(patientId: number, unitType: string) {
    return this.http.get(
      this.config.apiEndpoint + 'encounter/getCummulativeVitals/' + patientId + '/' + unitType, this.httpOptions);
  }
  getOfficeTest(chartID: string) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getOfficeTest/' + chartID, this.httpOptions);
  }

  getChartProblemDetail(problemId) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getchartproblemdetail/' + problemId, this.httpOptions);
  }
  getChartAssessmentsView(chartID: string) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getChartAssessmentView/' + chartID, this.httpOptions);
  }
  getChartAssessmentDetail(Id) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getChartAssessmentDetail/' + Id, this.httpOptions);
  }

  getChartPMHView(patientId: string, chartID: string) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getChartPMHView/' + patientId + '/' + chartID, this.httpOptions);
  }
  getChartPMHDetail(Id) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getChartPMHDetail/' + Id, this.httpOptions);
  }

  getChartPrescriptionView(patientId: string) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getChartPrescriptionView/' + patientId, this.httpOptions);
  }
  getChartAllergyView(patientId: string) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getChartAllergyView/' + patientId, this.httpOptions);
  }
  getChartProgressNoteListView(patientId: string, chartid: string) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getChartProgressNoteListView/' + patientId + '/' + chartid, this.httpOptions);
  }
  getChartProgressNoteTextView(noteid: string) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getChartProgressNoteTextView/' + noteid, this.httpOptions);
  }

  getChartProceduresSurgeryView(chartId: string) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getChartProceduresSurgeryView/' + chartId, this.httpOptions);
  }
  getChartSurgeryDetail(id: string) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getChartSurgeryDetail/' + id, this.httpOptions);
  }

  getChartFamilyHxView(chartId: string) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getChartFamilyHxView/' + chartId, this.httpOptions);
  }
  getChartFamilyHxDetail(id: string) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getChartFamilyHxDetail/' + id, this.httpOptions);
  }

  getPatPhysicalExamView(chart_id: string) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getPatPhysicalExamView/' + chart_id, this.httpOptions);
  }
  getPatPhysicalExamDetail(id: string) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getPatPhysicalExamDetail/' + id, this.httpOptions);
  }

  getChartHealthMainList(patient_id: string) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getChartHealthMainList/' + patient_id, this.httpOptions);
  }
  getChartHealthMainDetail_View(patient_id: string, maint_id: string) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getChartHealthMainDetail_View/' + patient_id + '/' + maint_id, this.httpOptions);
  }

  getDeviceDetailFromGlobalUDIDB(searchCriteria: SearchCriteria) {
    return this.http.post(this.config.apiEndpoint + 'encounter/getDeviceDetailFromGlobalUDIDB/', searchCriteria, this.httpOptions);
  }

  getPatImplantableDevicesSummary(patientId: number) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getPatImplantableDevicesSummary/' + patientId, this.httpOptions);
  }

  getPatImplantableDeviceDetailById(implantableDeviceId: number) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getPatImplantableDeviceDetailById/' + implantableDeviceId, this.httpOptions);
  }

  getChartAmendmentsView(chart_id: string) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getChartAmendmentsView/' + chart_id, this.httpOptions);
  }
  getChartAmendmentsDetail(id: string) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getChartAmendmentsDetail/' + id, this.httpOptions);
  }
 
  getGrowthChartData(practice_id: string, patient_id: string) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getGrowthChartData/' + practice_id + '/' + patient_id, this.httpOptions);
  }

  getChartImmunizationVIS(chartImmId: number) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getChartImmunizationVIS/' + chartImmId, this.httpOptions);
  }
  getChartImmunizationById(chartImmId: number) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getChartImmunizationById/' + chartImmId, this.httpOptions);
  }
  getPatientImmunization(patientId: string) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getPatientImmunization/' + patientId, this.httpOptions);
  }

  getChartCarePlan(chart_id: string) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getPatCarePlan/' + chart_id, this.httpOptions);
  }

  getDischargeDispositionSummary(chartId: number) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getPatientDischargeDispositionSummary/' + chartId, this.httpOptions);
  }

  getDischargeDispositionDetailById(dischargeId: number) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getPatientDischargeDispositionDetail/' + dischargeId, this.httpOptions);
  }

  getChartHealthConcernView(chartId: String) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getChartHealthConcernView/' + chartId, this.httpOptions);
  }

  getChartHealthConcernViewDetail(chartId: String) {
    return this.http.get(this.config.apiEndpoint + 'encounter/getChartHealthConcernViewDetail/' + chartId, this.httpOptions);
  }

  GenerateCCDA(obj: ORMCCDRequest) {
    return this.http.post(this.config.apiEndpoint + 'patient/GenerateCCDA', obj, this.httpOptions);
  }

  getChartDynamicTemplateDisplayModel(chartDynamicTemplateId: number) {

    let queryParams = new HttpParams();
    queryParams = queryParams.append("chart_dynamic_template_id", chartDynamicTemplateId.toString());

    return this.http.get(
      this.config.apiEndpoint + 'encounter-dynamic-template/getChartDynamicTemplateDisplayModel', { ...this.httpOptions, params: queryParams });
  }
}