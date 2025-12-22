import { SearchCriteria } from './../common/search-criteria';
import { UniquePipe } from './../../shared/unique-pipe';
import { LogMessage } from './../../shared/log-message';
import { GeneralOperation } from './../../shared/generalOperation';
import { EncounterService } from './../../services/encounter/encounter.service';
import { DateTimeUtil, DateTimeFormat } from '../../shared/date-time-util';
import { LOOKUP_LIST, LookupList } from '../../providers/lookupList.module';
import { Inject, Injectable } from '@angular/core';
import { PhonePipe } from '../../shared/phone-pipe';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { EncounterPrintViewerComponent } from '../../general-modules/encounter-print-viewer/encounter-print-viewer.component';
import { AlertTypeEnum } from 'src/app/shared/enum-util';
import { ListFilterPipe } from 'src/app/shared/list-filter-pipe';
@Injectable()
export class Chartreport_Print {
    constructor(private encounterService: EncounterService,
        private generalOperation: GeneralOperation,
        private logMessage: LogMessage,
        private dateTimeUtil: DateTimeUtil,
        @Inject(LOOKUP_LIST) public lookupList: LookupList,
        private modalService: NgbModal) { }

    chartId;
    patientId;    
    strHtmlString: string = "";
    strHTMLReportHeader: string = "";
    strHTMLReasonForVisit: string = "";
    strHTMLHpi: string = "";
    strHTMLVitals: string = "";
    strHTMLPatientSurgery: string = "";
    strHTMLPatientImmunizations: string = "";
    strHTMLPatientAllergies: string = "";
    strHTMLPatientProblems: string = "";
    strHTMLPatientFollowUp: string = "";
    strHTMLPatientFamilyHistory: string = "";
    strHTMLPatientSocialHistory: string = "";
    strHTMLPatientAnnotation: string = "";
    strHTMLPatientMedication: string = "";
    strHTMLPatientROS: string = "";
    strHTMLSignInfo: string = "";
    strHTMLAmendmentInfo: string = "";
    strHTMLPlanOfCareNotes: string = "";
    strHTMLPhysicalExam: string = "";
    strHTMLPatientCarePlan: string = "";
    strHTMLPatientCognitive: string = "";
    strHTMLPatientTreatmentNotes: string = "";
    strHTMLPatientAWV: string = "";
    strHTMLPatientLabOrderTest: string = "";
    strHTMLPatientHealthMent: string = "";
    strHTMLPastMedicalHistory: string = "";
    strHTMLChartAmendments: string = "";
    strHTMLPatientHealthMentDiabetic: string = "";
    strHTMLPatientHealthMentVaccination: string = "";
    strHTMLPatientOfficeTest: string = "";
    measureType: string;
    heightUnit: string;
    weightUnit: string;
    marital_status: string = "";
    patient_age: string = "";
    patient_gender: string = "";
    title: string = "";
    file_name: string = "";
    callingFrom: string = "";
    strModuleGap: string = `<hr class="hr-3-light-blue mt-1 mb-2" width='100%'></hr>`;
    acReasonForVisit;
    acPatVital;
    acPatProblem;
    acPatSurgery;
    acPatProcedure;
    acPatImmunization;
    acSocialHist;
    acFamilyHist;
    acPatPrescription;
    acPatAllergies;
    acPatROSDynamicDisplayModel;
    objROS: any;
    objPE: any;
    acPatPEDynamicDisplayModel;
    acPlanOfCareNotes;
    acPatAnnotation;
    acReportHeader;
    acCarePlan;
    acCognitiveStatus;
    acPatFollowup;
    acPastMedHist;
    acTreatmentNotes;
    acPrintSetting;
    acawvprint;
    acHealthMaint;
    acAmendments;
    acLabOrderTest;
    acOfficeTest;
    acAssessments;
    acUserChartModuleSetting;

    print_callBack = 0;
    getReportData() {
        debugger;
        this.print_callBack = 16;
        this.getReportHeader();
        this.getReasonForVisit();
        this.getPatVitals();
        this.getPatProblem();
        this.getPatSurgery();
        this.getPatImmunization();
        this.getPatSocialHist();
        this.getPatFamilyHist();
        this.getPatPrescription();
        this.getPatAllergies();
        this.getChartROS();
        this.getChartPhysicalExam();
        this.getPlanOfCareNotes();
        this.getPatAnnotaion();
        this.getPatFunctionalCognitive();
        this.getPatCarePlan();

    }
    getReasonForVisit() {
        this.encounterService.getChartReasonForVisit_HPI(this.chartId)
            .subscribe(
                data => {
                    debugger;
                    this.acReasonForVisit = data;
                    this.isDataLoaded();
                },
                error => this.logMessage.log("getReasonForVisit-Result" + error)
            );
    }
    getPatVitals() {
        this.encounterService.getChartVital(this.chartId)
            .subscribe(
                data => {
                    debugger;
                    this.acPatVital = data;
                    this.isDataLoaded();
                },
                error => this.logMessage.log("getPatVitals-Result" + error)
            );
    }
    getPatProblem() {
        let searchcrit: SearchCriteria = new SearchCriteria();
        searchcrit.param_list = [
            { name: "chart_id", value: this.chartId, option: "" },
            { name: "diag_option", value: "all", option: "" }
        ];
        this.encounterService.getChartProblem(searchcrit)
            .subscribe(
                data => {
                    debugger;
                    this.acPatProblem = data;
                    this.isDataLoaded();
                },
                error => this.logMessage.log("getPatProblem-Result" + error)
            );
    }
    getPatSurgery() {
        this.encounterService.getChartProceduresSurgeryView(this.chartId)
            .subscribe(
                data => {
                    debugger;
                    this.acPatSurgery = data;
                    this.isDataLoaded();
                },
                error => this.logMessage.log("getPatSurgery-Result" + error)
            );
    }
    getPatProcedures() {
        this.encounterService.getChartProcedures(this.chartId)
            .subscribe(
                data => {
                    debugger;
                    this.acPatProcedure = data;
                    this.isDataLoaded();
                },
                error => this.logMessage.log("getPatProcedures-Result" + error)
            );
    }
    getPatImmunization() {

        let searchCriteria: SearchCriteria = new SearchCriteria();
        searchCriteria.param_list = [
            { name: "patient_id", value: this.patientId.toString(), option: "" },
            { name: "chart_id", value: this.chartId, option: "" },
            { name: "include_deleted", value: false, option: "" },
            { name: "chart_immunization_ids", value: '', option: "" }

        ];


        this.encounterService.getChartImmunizationSummary(searchCriteria)
            .subscribe(
                data => {
                    debugger;
                    this.acPatImmunization = data;
                    this.isDataLoaded();
                },
                error => this.logMessage.log("getPatImmunization-Result" + error)
            );
    }
    getPatSocialHist() {
        this.encounterService.getChartSocialHistDetailById(this.chartId)
            .subscribe(
                data => {
                    debugger;
                    this.acSocialHist = data;
                    this.isDataLoaded();
                },
                error => this.logMessage.log("getPatSocialHist-Result" + error)
            );
    }
    getPatFamilyHist() {
        let searchcrit: SearchCriteria = new SearchCriteria();
        searchcrit.param_list = [
            { name: "chart_id", value: this.chartId, option: "" },
            { name: "criteria", value: "", option: "" }
        ];
        this.encounterService.getChartFamilyHis(searchcrit)
            .subscribe(
                data => {
                    debugger;
                    this.acFamilyHist = data;
                    this.isDataLoaded();
                },
                error => this.logMessage.log("getPatFamilyHist-Result" + error)
            );
    }
    getPatPrescription() {
        let searchcrit: SearchCriteria = new SearchCriteria();
        searchcrit.param_list = [
            { name: "patient_id", value: this.patientId, option: "" },
            { name: "criteria", value: "and ISNULL(archive,'') = 'N' and modified_user <> 'CCD'", option: "" }
        ];
        this.encounterService.getPatPrescription(searchcrit)
            .subscribe(
                data => {
                    this.acPatPrescription = data;
                    this.isDataLoaded();
                },
                error => this.logMessage.log("getPatPrescription-Result" + error)
            );
    }
    getPatAllergies() {
        let searchcrit: SearchCriteria = new SearchCriteria();
        searchcrit.param_list = [
            { name: "patient_id", value: this.patientId, option: "" },
            { name: "criteria", value: "and modified_user <> 'CCD'", option: "" }
        ];
        this.encounterService.getPatAllergies(searchcrit)
            .subscribe(
                data => {
                    this.acPatAllergies = data;
                    this.isDataLoaded();
                },
                error => this.logMessage.log("getPatAllergies-Result" + error)
            );
    }

    getChartROS() {
        this.encounterService.getChartROS(this.chartId).subscribe({
            next: (data: any) => {
                this.objROS = data;
                if (this.objROS != undefined) {
                    if (this.objROS.entry_type.toLowerCase() == 'free_text') {
                        this.isDataLoaded();
                    }
                    else if (this.objROS.entry_type.toLowerCase() == 'dynamic_template') {
                        this.encounterService.getChartDynamicTemplateDisplayModel(this.objROS.chart_dynamic_template_id)
                            .subscribe({
                                next: (dataSub: any) => {
                                    debugger;
                                    if (dataSub != undefined && dataSub != null) {
                                        this.acPatROSDynamicDisplayModel = dataSub.lst_dispaly_model;
                                    }
                                    this.isDataLoaded();
                                },
                                error: (error: any) => { this.logMessage.log("getPatROS-Result" + error) }
                            });
                    }

                }
                else {
                    this.isDataLoaded();
                }
            },
            error: (error: any) => {
                this.logMessage.log("getPatROS-Result" + error)
            }
        });
    }

    getPlanOfCareNotes() {
        this.encounterService.getPatProgressNotes(this.chartId)
            .subscribe(
                data => {
                    debugger;
                    this.acPlanOfCareNotes = data;
                    this.isDataLoaded();
                },
                error => this.logMessage.log("getPlanOfCareNotes-Result" + error)
            );
    }
    getPatAnnotaion() {
        this.encounterService.getPatAnnotation(this.chartId)
            .subscribe(
                data => {
                    debugger;
                    this.acPatAnnotation = data;
                    this.isDataLoaded();
                },
                error => this.logMessage.log("getPatAnnotaion-Result" + error)
            );
    }
    getPatCarePlan() {
        this.encounterService.getPatCarePlan(this.chartId)
            .subscribe(
                data => {
                    debugger;
                    this.acCarePlan = data;
                    this.isDataLoaded();
                },
                error => this.logMessage.log("getPatCarePlan-Result" + error)
            );
    }
    getPatFunctionalCognitive() {
        this.encounterService.getPatCognitive(this.chartId)
            .subscribe(
                data => {
                    debugger;
                    this.acCognitiveStatus = data;
                    this.isDataLoaded();
                },
                error => this.logMessage.log("getPatFunctionalCognitive-Result" + error)
            );
    }

    getChartPhysicalExam() {

        this.encounterService.getChartPhysicalExam(this.chartId).subscribe({
            next: (data: any) => {
                debugger;
                this.objPE = data;

                if (this.objPE != undefined) {

                    if (this.objPE.entry_type.toLowerCase() == 'free_text') {
                        this.isDataLoaded();
                    }
                    else if (this.objPE.entry_type.toLowerCase() == 'dynamic_template') {
                        debugger;
                        this.encounterService.getChartDynamicTemplateDisplayModel(this.objPE.chart_dynamic_template_id)
                            .subscribe({
                                next: (dataSub: any) => {
                                    debugger;
                                    if (dataSub != undefined && dataSub != null) {
                                        this.acPatPEDynamicDisplayModel = dataSub.lst_dispaly_model;
                                    }
                                    this.isDataLoaded();
                                },
                                error: (error: any) => { this.logMessage.log("getPatPE-Result" + error) }
                            });
                    }

                }
                else {
                    this.isDataLoaded();
                }
            },
            error: (error: any) => {
                this.logMessage.log("getPatPE-Result" + error)
            }
        });
    }

   
    getPatInjuryNotes() {
        this.encounterService.getPatInjuryNotes(this.patientId, this.chartId)
            .subscribe(
                data => {
                    debugger;
                    this.acTreatmentNotes = data;
                    this.isDataLoaded();
                },
                error => this.logMessage.log("getPatInjuryNotes-Result" + error)
            );
    }
    getPatFollowUp() {
        this.encounterService.getChartFollowUpProblem(this.chartId)
            .subscribe(
                data => {
                    debugger;
                    this.acPatFollowup = data;
                    this.isDataLoaded();
                },
                error => this.logMessage.log("getPatFollowUp-Result" + error)
            );
    }
    getPastMedHistory() {
        this.encounterService.getPastMedHistory(this.chartId)
            .subscribe(
                data => {
                    debugger;
                    this.acPastMedHist = data;
                    this.isDataLoaded();
                },
                error => this.logMessage.log("getPastMedHistory-Result" + error)
            );
    }
    getAssessments() {
        this.encounterService.getAssessments(this.chartId)
            .subscribe(
                data => {
                    debugger;
                    this.acPastMedHist = data;
                    this.isDataLoaded();
                },
                error => this.logMessage.log("getAssessments-Result" + error)
            );
    }
    getPatAWV_Print() {
        this.encounterService.getPatient_AWVPrint(this.patientId, this.chartId)
            .subscribe(
                data => {
                    debugger;
                    this.acawvprint = data;
                    this.isDataLoaded();
                },
                error => this.logMessage.log("getPatAWV_Print-Result" + error)
            );
    }
    getHealthMaint_Print() {
        this.encounterService.getHealthMaint_Print(this.patientId, this.chartId)
            .subscribe(
                data => {
                    debugger;
                    this.acHealthMaint = data;
                    this.isDataLoaded();
                },
                error => this.logMessage.log("getHealthMaint_Print-Result" + error)
            );
    }
    getLabOrderTest_Print() {
        this.encounterService.getLabOrderTest_Print(this.chartId)
            .subscribe(
                data => {
                    debugger;
                    this.acLabOrderTest = data;
                    this.isDataLoaded();
                },
                error => this.logMessage.log("getLabOrderTest_Print-Result" + error)
            );
    }
    getOfficeTest_Print() {
        this.encounterService.getOfficeTestPrint(this.chartId)
            .subscribe(
                data => {
                    debugger;
                    this.acOfficeTest = data;
                    this.isDataLoaded();
                },
                error => this.logMessage.log("getOfficeTestPrint-Result" + error)
            );
    }
    getAmendments_Print() {
        this.encounterService.getAmendments_Print(this.chartId)
            .subscribe(
                data => {
                    debugger;
                    this.acAmendments = data;
                    this.isDataLoaded();
                },
                error => this.logMessage.log("getAmendments_Print-Result" + error)
            );
    }

    getModuleUserPrintSetting(value): Boolean {
        let print: Boolean = false;
        for (let i = 0; i < this.lookupList.lstUserChartModuleSetting.length; i++) {
            if (this.lookupList.lstUserChartModuleSetting[i].module_swf.toString().toLowerCase() == value
                && (this.lookupList.lstUserChartModuleSetting[i].in_print == true)
            ) {
                print = true;
                break;
            }
        }
        return print;
    }
    getModulePrintSetting(value): Boolean {
        let Print: Boolean = false;
        for (var i = 0; i < this.acPrintSetting.length; i++) {
            if (this.acPrintSetting[i].module_swf.toString().toLowerCase() == value && (this.acPrintSetting[i].in_print == true)) {
                Print = true;
                break;
            }
        }
        return Print;
    }
    getReportHeader() {
        this.encounterService.getChartReportDetails(this.chartId)
            .subscribe(
                data => {
                    this.acReportHeader = data;
                    this.isDataLoaded();
                },
                error => alert(error)
            );
    }
    isDataLoaded() {

        this.print_callBack--;
        if (this.print_callBack == 0) {
            this.createHtml();

            const modalRef = this.modalService.open(EncounterPrintViewerComponent, this.poupUpOptions);
            modalRef.componentInstance.print_html = this.strHtmlString;
           
        }

    }
    poupUpOptions: NgbModalOptions = {
        backdrop: 'static',
        keyboard: false,
        size: 'lg'
    };

    checkUrlExists(url): boolean {
        debugger;
        const xhr = new XMLHttpRequest();
        try {
            xhr.open("HEAD", url, false); // `false` makes the request synchronous
            xhr.send();
            return xhr.status >= 200 && xhr.status < 300; // Check for 2xx status
        } catch (error) {
            console.error("Error checking URL:", error);
            return false; // URL doesn't exist or is unreachable
        }
    }
    ReportHeader() {
        this.strHTMLReportHeader = "";
        if (this.callingFrom != "referral") {
            var dob: Date = new Date(this.acReportHeader[0].dob);
            this.patient_age = "";

            if (Number(this.acReportHeader[0].age_year) > 0) {
                this.patient_age = this.acReportHeader[0].age_year + " Y"
            }
            if (Number(this.acReportHeader[0].age_month) > 0) {
                if (this.patient_age != "")
                    this.patient_age += " - ";
                this.patient_age += this.acReportHeader[0].age_month + " M"
            }

            if (this.patient_age != "")
                this.patient_age = " ( " + this.patient_age + " )";


            if (this.callingFrom == "transcription") {
                this.title = this.file_name;
                //strHTMLReportHeader="<title>"+ this.file_name+"</title>";
            }
            else if (this.callingFrom == "referral") {
                this.title = this.acReportHeader[0].patient_name;
            }
            else if (this.callingFrom == "transcriptionEncounterReport") {
                this.title = this.file_name;
            }
            else {
                this.title = this.acReportHeader[0].patient_name;
                //strHTMLReportHeader="<title>"+ this.acReportHeader[0].patient_name+"</title>";
            }
            this.patient_gender = this.acReportHeader[0].gender == null ? "" : this.acReportHeader[0].gender.toString().toLocaleLowerCase() == "male" ? "M" : this.acReportHeader[0].gender.toString().toLocaleLowerCase() == "female" ? "F" : this.acReportHeader[0].gender.toString().toUpperCase();

            var provider_name: String = this.acReportHeader[0].provider_name;

            // let acPath = this.generalOperation.filterArray(this.lookupList.lstdocumentPath, "category_name", "PracticeLogo");
            // var strLogoHTML: String = "";
            // if (acPath != null && acPath.length > 0) {
            //     var logoPath: String = "";
            //     if (this.callingFrom == "transcription" || this.callingFrom == "referral"
            //         || this.callingFrom == "transcriptionEncounterReport") {
            //         logoPath = acPath[0].upload_path + "/" + this.lookupList.practiceInfo.practiceId + "/PracticeLogo/logo_small.png";
            //     }
            //     else {
            //         logoPath = acPath[0].download_path + "/" + this.lookupList.practiceInfo.practiceId + "/PracticeLogo/logo_small.png";
            //     }
            //     //logoPath=acPath.getItemAt(0).download_path+"/"+GeneralOptions.practiceID+"/PracticeLogo/logo_small.png";					
            //     logoPath = logoPath.replace("\\", "/");
            //     strLogoHTML = "<img src='" + logoPath + "' width='175'/>";
            // }

            let acPath = this.generalOperation.filterArray(this.lookupList.lstdocumentPath, "category_name", "PracticeLogo");
            var strLogoHTML: String = "";
            if (acPath != null && acPath.length > 0) {
                var logoPath: String = "";
                if (this.callingFrom == "transcription" || this.callingFrom == "referral" || this.callingFrom == "fax"
                    || this.callingFrom == "transcriptionEncounterReport") {
                    logoPath = acPath[0].upload_path + "/" + this.lookupList.practiceInfo.practiceId + "/PracticeLogo/logo-small.png";
                }
                else {
                    logoPath = acPath[0].download_path + "/" + this.lookupList.practiceInfo.practiceId + "/PracticeLogo/logo-small.png";
                }
                if (this.checkUrlExists(logoPath)) {
                    strLogoHTML = "<img src='" + logoPath + "' class='practice-header-logo' height='70px'/>";
                }
                else
                    strLogoHTML = "  ";
            }


            var str_home_phone: String = "";
            var str_work_phone: String = "";
            var str_cell_phone: String = "";
            if (this.acReportHeader[0].pat_home_phone != "") {
                str_home_phone = new PhonePipe().transform(this.acReportHeader[0].pat_home_phone);
            }
            if (this.acReportHeader[0].pat_work_phone != "") {
                str_work_phone = new PhonePipe().transform(this.acReportHeader[0].pat_work_phone);
            }
            if (this.acReportHeader[0].pat_cell_phone != "") {
                str_cell_phone = new PhonePipe().transform(this.acReportHeader[0].pat_cell_phone);
            }

            if (strLogoHTML != "") {
                this.strHTMLReportHeader += " <table width='98%' border='0' cellpadding='0' cellspacing='0'> " +
                    " <tr>" +
                    "  <td rowspan='4' width='200' align='center' valign='top'>" + strLogoHTML + "</td><td height='10'></td>" +
                    "</tr>" +
                    "<tr>" +
                    "  <td align='left' valign='bottom'><span class='styleTopHeader'>" + this.acReportHeader[0].practice_name + "</span></td>" +
                    "</tr>" +
                    "<tr >" +
                    "  <td align='left' valign='bottom' height='20'><span class='styleTopSubHeader'>" + this.acReportHeader[0].location_address + "</span></td>" +
                    "</tr>" +
                    "<tr >" +
                    "  <td align='left' valign='top'><span class='styleTopSubHeader'> Phone:&nbsp;" + this.acReportHeader[0].location_phone + "&nbsp;&nbsp;&nbsp;&nbsp; Fax:&nbsp;" + this.acReportHeader[0].location_fax + "</span></td>" +
                    "</tr>" +
                    "  <tr >" +
                    "	<td height='1' colspan='2' align='center' valign='top'><hr size='2' width='100%' color='#009140'>" +
                    "	  </hr>" +
                    "	</td>" +
                    "  </tr>" +
                    "</table> ";
            }
            else {
                this.strHTMLReportHeader += " <table width='98%' border='0' cellpadding='0' cellspacing='0'> " +
                    "<tr>" +
                    "  <td align='center' valign='bottom'><span class='styleTopHeader'>" + this.acReportHeader[0].practice_name + "</span></td>" +
                    "</tr>" +
                    "<tr >" +
                    "  <td align='center' valign='bottom' height='20'><span class='styleTopSubHeader'>" + this.acReportHeader[0].location_address + "</span></td>" +
                    "</tr>" +
                    "<tr >" +
                    "  <td align='center' valign='top'><span class='styleTopSubHeader'> Phone:&nbsp; " + this.acReportHeader[0].location_phone + "&nbsp;&nbsp;&nbsp;&nbsp; Fax:&nbsp;" + this.acReportHeader[0].location_fax + "</span></td>" +
                    "</tr>" +
                    "  <tr >" +
                    "	<td height='1' colspan='2' align='center' valign='top'><hr size='2' width='100%' color='#009140'>" +
                    "	  </hr>" +
                    "	</td>" +
                    "  </tr>" +
                    "</table> ";
            }


            this.strHTMLReportHeader += "<table width='98%' border='0' cellpadding='0' cellspacing='0'>" +
                " <tr>" +
                "	<td width='50%'> <span class='styleMainHeading'>Patient&nbsp;:&nbsp;</span><span class='styleSubHeading'> " + this.acReportHeader[0].patient_name + "</span></td>" +
                "	<td width='50%' valign='top' align='right'><span class='styleMainHeading'>Visit Date&nbsp;:&nbsp;</span><span class='styleSubHeading'>" + this.acReportHeader[0].visit_date + "</span></td>" +
                "  </tr>" +
                "  <tr>" +
                "	<td valign='top'> <span class='styleMainHeading'>DOB&nbsp;:&nbsp;</span><span class='styleNormal'> " + this.acReportHeader[0].dob + " &nbsp;" + this.patient_age + " &nbsp; &nbsp; &nbsp; " + this.acReportHeader[0].gender + "</span></td>" +
                "	<td width='50%' valign='top' align='right'><span class='styleMainHeading'>Provider&nbsp;:&nbsp;</span><span class='styleSubHeading'>" + provider_name + "</span></td>" +
                "  </tr>" +
                "  <tr>" +
                "	<td valign='top'><span class='styleMainHeading'>Address&nbsp;:&nbsp;</span><span class='styleNormal'> " + this.acReportHeader[0].patient_address + "</span></td>" +
                "  </tr>";
            if (str_home_phone != "" || str_work_phone != "" || str_cell_phone != "") {
                this.strHTMLReportHeader += "<tr><td colspan='2' valign='top' align='left'>";
                if (str_home_phone != "") {
                    this.strHTMLReportHeader += "<span class='styleMainHeading'>Home Phone&nbsp;:&nbsp;</span><span class='styleNormal'>" + str_home_phone + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>";
                }
                if (str_work_phone != "") {
                    this.strHTMLReportHeader += "<span class='styleMainHeading'>Work Phone&nbsp;:&nbsp;</span><span class='styleNormal'>" + str_work_phone + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>";
                }
                if (str_cell_phone) {
                    this.strHTMLReportHeader += "<span class='styleMainHeading'>Cell Phone&nbsp;:&nbsp;</span><span class='styleNormal'>" + str_cell_phone + "</span>";
                }
                this.strHTMLReportHeader += "</td></tr>";
            }

            this.strHTMLReportHeader += "   <tr>" +
                "	<td valign='top' align='left'><span class='styleMainHeading'>Emergency Contact&nbsp;:&nbsp;</span><span class='styleNormal'>" + this.acReportHeader[0].emrg_contact_name + " " + this.acReportHeader[0].emrg_contact + " </span></td>" +
                "  </tr>" +
                "  <tr>" +
                "	<td  valign='top' align='left'><span class='styleMainHeading'>Race&nbsp;:&nbsp;</span><span class='styleNormal'>" + this.acReportHeader[0].race + "</span></td>" +
                "  </tr>" +
                "  <tr >" +
                "	<td height='1' colspan='2' align='center' valign='top'><hr size='2' width='100%' color='#009140'>" +
                "	  </hr>" +
                "	</td>" +
                "  </tr>" +
                "</table>";
            this.strHtmlString = this.strHTMLReportHeader;
            this.strHtmlString += this.strModuleGap;
        }
    }
    RFV() {
        try {
            this.strHTMLReasonForVisit = "";
            //if (this.acReasonForVisit != null && this.acReasonForVisit.length > 0) {
            if (this.acReasonForVisit) {
                if (this.acReasonForVisit.reason_detail != null && this.acReasonForVisit.reason_detail != "") {
                    this.strHTMLReasonForVisit += "<tr>" +
                        "	<td  class='styleModuleSubHeader'>Visit Reason:</td>" +
                        "</tr>" +
                        "<tr>" +
                        "	 <td style='text-align:justify;' ><span class='styleNormal'>" + this.generalOperation.ReplaceAll(this.generalOperation.ReplaceHTMLReservedWords(this.acReasonForVisit.reason_detail), "\n", "<br>") + "</span></td>" +
                        " </tr>";
                }

                if (this.acReasonForVisit.hpi_detail != null && this.acReasonForVisit.hpi_detail != "") {
                    this.strHTMLReasonForVisit += "<tr>" +
                        "	<td  class='styleModuleSubHeader' >HPI:</td>" +
                        "</tr>" +
                        "<tr>" +
                        "	 <td style='text-align:justify;' ><span class='styleNormal'>" + this.generalOperation.ReplaceAll(this.generalOperation.ReplaceHTMLReservedWords(this.acReasonForVisit.hpi_detail), "\n", "<br>") + "</span></td>" +
                        " </tr>";

                }

                if (this.strHTMLReasonForVisit != "") {
                    this.strHTMLReasonForVisit = " <table width='98%' class='tableMain'> <tbody>" +
                        " <tr  ><th>Reason For Visit / History Of Presenting Illness</th> </tr>" +
                        this.strHTMLReasonForVisit +
                        " </tbody></table>";

                }
                this.strHtmlString += this.strHTMLReasonForVisit;
                this.strHtmlString += this.strModuleGap;
            }
        }
        catch (e) {
            this.logMessage.log("RFV-HTML" + e);
        }
    }
    Vital() {
        try {
            this.strHTMLVitals = "";
            //if (this.acPatVital != null && this.acPatVital.length > 0) {
            if (this.acPatVital) {
                var strWeightString: String = "";
                var strHeightString: String = "";
                var strHeight: String = "";
                var strWeight: String = "";

                this.measureType = "english";//default			
                if (this.measureType == "english") {

                    this.heightUnit = "feet";
                    this.weightUnit = "pound";

                    strHeight = this.acPatVital.height_feet != null ? this.acPatVital.height_feet : "";
                    strWeight = this.acPatVital.weight_lbs != null ? this.acPatVital.weight_lbs : "";

                    if (strWeight != "" && Number(strWeight) > 0) {
                        if (Number(strWeight.split(".")[0]) > 0) {
                            strWeightString += strWeight.split(".")[0] + " lbs";
                        }
                        if (Number(strWeight.split(".")[1]) > 0) {
                            strWeightString += " " + strWeight.toString().split(".")[1] + " ozs";
                        }
                    }
                    if (strHeight != "" && Number(strHeight) > 0) {
                        if (Number(strHeight.split(".")[0]) > 0) {
                            strHeightString += strHeight.toString().split(".")[0] + " ft.";
                        }
                        if (Number(strHeight.split(".")[1]) > 0) {
                            strHeightString += " " + strHeight.toString().split(".")[1] + " in.";
                        }
                    }
                }
                else {
                    this.heightUnit = "meter";
                    this.weightUnit = "kg";

                    strHeight = this.acPatVital.height_meters != null ? this.acPatVital.height_meters : "";
                    strWeight = this.acPatVital.weight_kg != null ? this.acPatVital.weight_kg : "";

                    if (strWeight != "" && Number(strWeight) > 0) {
                        strWeightString = strWeight + " kg";
                    }

                    if (strHeight != "" && Number(strHeight) > 0) {
                        strHeightString = strHeight + " m";
                    }
                }

                this.strHTMLVitals = " <table width='98%' class='tableMain'><tbody><tr ><th colspan='4'>Vitals</th></tr> ";
                //strHTMLVitals+=" <tr > "+
                //	" <td valign='top'>"+
                //	" <table width='98%' class='tableNoBorder'>";

                var no = 0;
                var i = 0;

                if ((strWeight != "" && Number(strWeight) > 0) || (strHeight != "" && Number(strHeight) > 0)
                    || (this.acPatVital.bmi != null && this.acPatVital.bmi != "")
                    || (this.acPatVital.temperature_fahren != null && this.acPatVital.temperature_fahren != "")) {

                    this.strHTMLVitals += " <tr> ";

                    if (strWeightString != "") {
                        this.strHTMLVitals += " <td valign='top'> " +
                            " <span class='styleNormalBold'>Weight:&nbsp;</span><span class='styleNormal'>" + strWeightString + "</span>" +
                            " </td>";
                    }
                    else {
                        this.strHTMLVitals += " <td valign='top'> " +
                            " <span class='styleNormalBold'>Weight:&nbsp;</span>" +
                            " </td>";
                    }

                    if (strHeightString != "") {
                        this.strHTMLVitals += " <td valign='top'> " +
                            " <span class='styleNormalBold'>Height:&nbsp;</span><span class='styleNormal'>" + strHeightString + " </span>" +
                            " </td>";
                    }
                    else {
                        this.strHTMLVitals += " <td  > " +
                            " <span class='styleNormalBold'>Height:&nbsp;</span>" +
                            " </td>";
                    }

                    if (this.acPatVital.bmi != null && this.acPatVital.bmi != "") {
                        this.strHTMLVitals += " <td valign='top'> " +
                            " <span class='styleNormalBold'>BMI:&nbsp;</span><span class='styleNormal'>" + this.acPatVital.bmi + " </span>" +
                            " </td>";
                    }
                    else {
                        this.strHTMLVitals += " <td  > " +
                            " <span class='styleNormalBold'>BMI:&nbsp;</span>" +
                            " </td>";
                    }

                    // Degree Sign ~= &#176;
                    if (this.acPatVital.temperature_fahren != null && this.acPatVital.temperature_fahren != "") {
                        this.strHTMLVitals += " <td  > " +
                            " <span class='styleNormalBold'>Temprature:&nbsp;</span><span class='styleNormal'>" + this.acPatVital.temperature_fahren + " &#176;F</span>" +
                            " </td>";
                    }
                    else {
                        this.strHTMLVitals += " <td  > " +
                            " <span class='styleNormalBold'>Temprature:&nbsp;</span>" +
                            " </td>";
                    }

                    this.strHTMLVitals += "</tr>";
                }

                no = 0;
                if ((this.acPatVital.oxygen_saturation != null && this.acPatVital.oxygen_saturation != "")
                    || (this.acPatVital.oxygen_source != null && this.acPatVital.oxygen_source != "")
                    || (this.acPatVital.oxygen_flow != null && this.acPatVital.oxygen_flow != "")
                    || (this.acPatVital.pain != null && this.acPatVital.pain != "")
                    || (this.acPatVital.head_circumference_inch != null && this.acPatVital.head_circumference_inch != "")
                    || (this.acPatVital.respiration != null && this.acPatVital.respiration != "")) {
                    this.strHTMLVitals += "<tr>";

                    if (this.acPatVital.head_circumference_inch != null && this.acPatVital.head_circumference_inch != "") {
                        if (no > 0 && no % 4 == 0) {
                            this.strHTMLVitals += "</tr><tr>";
                        }

                        this.strHTMLVitals += " <td  > " +
                            " <span class='styleNormalBold'>Head Circumference:&nbsp;</span><span class='styleNormal'>" + this.acPatVital.head_circumference_inch + "</span>" +
                            " </td>";
                        no++;

                    }
                    if (this.acPatVital.respiration != null && this.acPatVital.respiration != "") {
                        if (no > 0 && no % 4 == 0) {
                            this.strHTMLVitals += "</tr><tr>";
                        }

                        this.strHTMLVitals += " <td  > " +
                            " <span class='styleNormalBold'>Respiratory Rate:&nbsp;</span><span class='styleNormal'>" + this.acPatVital.respiration + "</span>" +
                            " </td>";
                        no++;

                    }
                    if (this.acPatVital.oxygen_saturation != null && this.acPatVital.oxygen_saturation != "") {
                        if (no > 0 && no % 4 == 0) {
                            this.strHTMLVitals += "</tr><tr>";
                        }

                        this.strHTMLVitals += " <td  > " +
                            " <span class='styleNormalBold'>O2 Saturation:&nbsp;</span><span class='styleNormal'>" + this.acPatVital.oxygen_saturation + "</span>" +
                            " </td>";
                        no++;
                        //										
                    }
                    if (this.acPatVital.oxygen_source != null && this.acPatVital.oxygen_source != "") {
                        if (no > 0 && no % 4 == 0) {
                            this.strHTMLVitals += "</tr><tr>";
                        }

                        this.strHTMLVitals += " <td  > " +
                            " <span class='styleNormalBold'>O2 Source:&nbsp;</span><span class='styleNormal'>" + this.acPatVital.oxygen_source + "</span>" +
                            " </td>";
                        no++;
                    }
                    if (this.acPatVital.oxygen_flow != null && this.acPatVital.oxygen_flow != "") {
                        if (no > 0 && no % 4 == 0) {
                            this.strHTMLVitals += "</tr><tr>";
                        }

                        this.strHTMLVitals += " <td  > " +
                            " <span class='styleNormalBold'>O2 Flow:&nbsp;</span><span class='styleNormal'>" + this.generalOperation.ReplaceHTMLReservedWords(this.acPatVital.oxygen_flow) + "</span>" +
                            " </td>";
                        no++;

                    }
                    if (this.acPatVital.pain != null && this.acPatVital.pain != "") {
                        if (no > 0 && no % 4 == 0) {
                            this.strHTMLVitals += "</tr><tr>";
                        }

                        this.strHTMLVitals += " <td  > " +
                            " <span class='styleNormalBold'>Pain:&nbsp;</span><span class='styleNormal'>" + this.acPatVital.pain + "</span>" +
                            " </td>";
                        no++;

                    }

                    if (no > 0 && no % 4 != 0) {
                        while (no % 4 != 0) {
                            this.strHTMLVitals += "<td valign='top'></td>";
                            no++;
                        }
                    }

                    this.strHTMLVitals += " </tr> ";

                }
                // BP 1st Reading ***********************************					
                if ((this.acPatVital.systolic_bp1 != "" && this.acPatVital.systolic_bp1 != null) || (this.acPatVital.diastolic_bp1 != "" && this.acPatVital.diastolic_bp1 != null) ||
                    (this.acPatVital.pulse != "" && this.acPatVital.pulse != null) || (this.acPatVital.monitoringposition_bp1 != "" && this.acPatVital.monitoringposition_bp1 != null)) {
                    no = 0;

                    this.strHTMLVitals += "<tr>";
                    if ((this.acPatVital.systolic_bp1 != null && this.acPatVital.systolic_bp1 != "") || (this.acPatVital.diastolic_bp1 != null && this.acPatVital.diastolic_bp1 != "")) {
                        this.strHTMLVitals += " <td  > " +
                            " <span class='styleNormalBold'>BP Reading 1:&nbsp;</span><span class='styleNormal'>" + this.acPatVital.systolic_bp1 + "/" + this.acPatVital.diastolic_bp1 + " (mm/Hg)</span>" +
                            " </td>";
                        no++;

                    }
                    else {
                        this.strHTMLVitals += " <td  > " +
                            " <span class='styleNormalBold'>BP Reading 1:&nbsp;</span>" +
                            " </td>";
                        no++;
                    }

                    if (this.acPatVital.pulse != null && this.acPatVital.pulse != "") {
                        this.strHTMLVitals += " <td valign='top'> " +
                            " <span class='styleNormalBold'>Heart Rate:&nbsp;</span><span class='styleNormal'>" + this.acPatVital.pulse + " (b/min)</span>" +
                            " </td>";
                        no++;
                    }
                    else {
                        this.strHTMLVitals += " <td  > " +
                            " <span class='styleNormalBold'>Heart Rate:&nbsp;</span>" +
                            " </td>";
                        no++;
                    }

                    if (this.acPatVital.monitoringposition_bp1 != null && this.acPatVital.monitoringposition_bp1 != "") {
                        this.strHTMLVitals += " <td  > " +
                            " <span class='styleNormalBold'>Monitoring Position:&nbsp;</span><span class='styleNormal'>" + this.acPatVital.monitoringposition_bp1 + "</span>" +
                            " </td>";
                        no++;
                    }
                    else {
                        this.strHTMLVitals += " <td valign='top'> " +
                            " <span class='styleNormalBold'>Monitoring Position:&nbsp;</span>" +
                            " </td>";
                        no++;
                    }

                    if (no > 0 && no % 4 != 0) {
                        while (no % 4 != 0) {
                            this.strHTMLVitals += "<td  ></td>";
                            no++;
                        }
                    }

                    this.strHTMLVitals += "</tr>";
                }
                //--------------------------------------------

                // BP 2nd Reading ***********************************					
                if ((this.acPatVital.systolic_bp2 != "" && this.acPatVital.systolic_bp2 != null) || (this.acPatVital.diastolic_bp2 != "" && this.acPatVital.diastolic_bp2 != null) ||
                    (this.acPatVital.monitoringposition_bp2 != "" && this.acPatVital.monitoringposition_bp2 != null) || (this.acPatVital.reading_delay != "" && this.acPatVital.reading_delay != null)) {
                    no = 0;
                    this.strHTMLVitals += "<tr>";
                    if ((this.acPatVital.systolic_bp2 != null && this.acPatVital.systolic_bp2 != "") || (this.acPatVital.diastolic_bp2 != null && this.acPatVital.diastolic_bp2 != "")) {
                        this.strHTMLVitals += " <td valign='top'> " +
                            " <span class='styleNormalBold'>BP Reading 2:&nbsp;</span><span class='styleNormal'>" + this.acPatVital.systolic_bp2 + "/" + this.acPatVital.diastolic_bp2 + " (mm/Hg)</span>" +
                            " </td>";
                        no++;
                    }
                    else {
                        this.strHTMLVitals += " <td  > " +
                            " <span class='styleNormalBold'>BP Reading 2:&nbsp;</span>" +
                            " </td>";
                        no++;
                    }
                    if (this.acPatVital.pulse_bp2 != null && this.acPatVital.pulse_bp2 != "") {
                        this.strHTMLVitals += " <td  > " +
                            " <span class='styleNormalBold'>Heart Rate:&nbsp;</span><span class='styleNormal'>" + this.acPatVital.pulse_bp2 + " (b/min)</span>" +
                            " </td>";
                        no++;
                    }
                    else {
                        this.strHTMLVitals += " <td  > " +
                            " <span class='styleNormalBold'>Heart Rate:&nbsp;</span>" +
                            " </td>";
                        no++;
                    }

                    if (this.acPatVital.monitoringposition_bp2 != null && this.acPatVital.monitoringposition_bp2 != "") {
                        this.strHTMLVitals += " <td valign='top'> " +
                            " <span class='styleNormalBold'>Monitoring Position:&nbsp;</span><span class='styleNormal'>" + this.acPatVital.monitoringposition_bp2 + "</span>" +
                            " </td>";
                        no++;

                    }
                    else {
                        this.strHTMLVitals += " <td  > " +
                            " <span class='styleNormalBold'>Monitoring Position:&nbsp;</span>" +
                            " </td>";
                        no++;
                    }

                    if (this.acPatVital.reading_delay != null && this.acPatVital.reading_delay != "") {
                        this.strHTMLVitals += " <td   style='border:none;'> " +
                            " <span class='styleNormalBold'>Reading Delay:&nbsp;</span><span class='styleNormal'>" + this.acPatVital.reading_delay + "</span>" +
                            " </td>";

                        no++;
                    }
                    else {
                        this.strHTMLVitals += " <td  > " +
                            " <span class='styleNormalBold'>Reading Delay:&nbsp;</span>" +
                            " </td>";
                        no++;
                    }
                    this.strHTMLVitals += " </tr> ";
                }
                //--------------------------------------------
                if (this.acPatVital.comments != null && this.acPatVital.comments != "") {

                    if (this.acPatVital.comments.trim() != "") {
                        this.strHTMLVitals += "<tr>" +
                            " <td colspan='4'> " +
                            " <span class='styleNormalBold'>Comments:&nbsp;</span><span class='styleNormal'>" + this.generalOperation.ReplaceAll(this.generalOperation.ReplaceHTMLReservedWords(this.acPatVital.comments), "\n", "<br>") + "</span>" +
                            " </td>" +
                            " </tr>";
                    }
                }
                //strHTMLVitals+=" </table></td></tr> ";
                this.strHTMLVitals += " </tbody></table> ";
                this.strHtmlString += this.strHTMLVitals;
                this.strHtmlString += this.strModuleGap;//"<br>";
            }

        }
        catch (e) {
            this.logMessage.log("Vital-HTML" + e);
        }
    }
    Problems() {
        try {
            this.strHTMLPatientProblems = "";
            var prob_date: string = "";
            var prob_code: string = "";
            var prob_desc: string = "";
            var prob_comments: string = "";
            var visit_date: string;
            var created_date: string;

            if (this.acPatProblem != null && this.acPatProblem.length > 0) {
                this.strHTMLPatientProblems = " <table width='98%' class='tableMain'> <tbody>" +
                    "<tr>" +
                    "<th colspan='5'>Problem List</th>" +
                    "</tr>" +
                    "<tr class='styleModuleSubHeader'>" +
                    "<td width='10'></td>" +
                    "<td width ='65'>Date</td>" +
                    "<td width ='70' >Code</td>" +
                    "<td>Description</td>" +
                    "<td>Comments</td>" +
                    "</tr>";

                this.acPatProblem = this.generalOperation.filterArray(this.acPatProblem, "status", "Active");
                if (this.acPatProblem != null && this.acPatProblem.length > 0) {
                    var colCount = 2;

                    var strPrimary: string = "";


                    var descriptionColSpan = 5;
                    var commentsColSpan = 3;
                    var i = 0;
                    var count = 1;

                    var strCount: String;
                    if (this.lookupList.logedInUser.userType == "Transcription") {
                        for (i = 0; i < this.acPatProblem.length; i++) {
                            prob_date = (this.acPatProblem[i].prob_date != null && this.acPatProblem[i].prob_date != "01/01/1900") ? this.acPatProblem[i].prob_date : "";
                            prob_code = (this.acPatProblem[i].diag_code != null) ? this.acPatProblem[i].diag_code : "";
                            prob_desc = (this.acPatProblem[i].diag_description != null) ? this.acPatProblem[i].diag_description : "";
                            prob_comments = (this.acPatProblem[i].comments != null) ? this.acPatProblem[i].comments : "";
                            {
                                if (this.acPatProblem[i].primary_diag == true) {
                                    strPrimary = "<span class='styleNormalBold'>(Primary Diagnose)</span>";
                                }
                                else {
                                    strPrimary = "";
                                }
                                if (count > 0 && count % 2 == 0)
                                    this.strHTMLPatientProblems += "<tr class='styleAlternateRowColor'>";
                                else
                                    this.strHTMLPatientProblems += "<tr>";
                                this.strHTMLPatientProblems += "<td valign='top'>" + count + "</td> ";

                                //rowHeight=17;
                                strCount = count + "";
                                //CurrentDF.formatString = "MM/DD/YYYY";
                                this.strHTMLPatientProblems += " <td valign='top' >" + prob_date.substring(0, 10) + "</td> ";
                                strCount = "";
                                this.strHTMLPatientProblems += " <td valign='top'  >" + prob_code.trim() + "</td> ";
                                strCount = "";
                                this.strHTMLPatientProblems += " <td valign='top'>" + this.generalOperation.ReplaceHTMLReservedWords(prob_desc.trim()) + " " + strPrimary + "</td> ";
                                strCount = "";
                                this.strHTMLPatientProblems += " <td valign='top'>" + this.generalOperation.ReplaceHTMLReservedWords(prob_comments) + "</td> ";
                                count++;
                                this.strHTMLPatientProblems += " </tr> ";
                                sno++;
                            }

                        }
                    }
                    else {
                        var sno = 1;
                        for (i = 0; i < this.acPatProblem.length; i++) {
                            prob_date = (this.acPatProblem[i].prob_date != null && this.acPatProblem[i].prob_date != "01/01/1900") ? this.acPatProblem[i].prob_date : "";
                            prob_code = (this.acPatProblem[i].diag_code != null) ? this.acPatProblem[i].diag_code : "";
                            prob_desc = (this.acPatProblem[i].diag_description != null) ? this.acPatProblem[i].diag_description : "";
                            prob_comments = (this.acPatProblem[i].comments != null) ? this.acPatProblem[i].comments : "";
                            //CurrentDF.formatString = "MM/DD/YYYY";
                            if (this.acPatProblem[i].date_created != null) {
                                created_date = this.dateTimeUtil.getDateTimeString(this.acPatProblem[i].date_created.toString(), DateTimeFormat.DATEFORMAT_MM_DD_YYYY);
                            }
                            else
                                created_date = this.dateTimeUtil.getCurrentDateTimeStringWithFormat(DateTimeFormat.DATEFORMAT_MM_DD_YYYY);

                            visit_date = this.dateTimeUtil.getDateTimeString(this.acReportHeader[0].visit_date.toString(), DateTimeFormat.DATEFORMAT_MM_DD_YYYY);
                            created_date = prob_date;
                            if (this.dateTimeUtil.getDateTimeFromString(created_date, DateTimeFormat.DATEFORMAT_MM_DD_YYYY) >= this.dateTimeUtil.getDateTimeFromString(visit_date, DateTimeFormat.DATEFORMAT_MM_DD_YYYY)) {
                                if (sno == 1) {
                                    this.strHTMLPatientProblems += "<tr>" +
                                        " <td  colspan='5' class='styleModuleSubHeader'>Problems at this Visit</td></tr> ";
                                }
                                if (this.acPatProblem[i].primary_diag == true) {
                                    strPrimary = "<span class='styleNormalBold'>(Primary Diagnose)</span>";
                                }
                                else {
                                    strPrimary = "";
                                }

                                //this.strHTMLPatientProblems+=	" <tr>" +
                                if (count > 0 && count % 2 == 0)
                                    this.strHTMLPatientProblems += "<tr class='styleAlternateRowColor'>";
                                else
                                    this.strHTMLPatientProblems += "<tr>";
                                //"<td width='10' valign='top'></td>" +
                                this.strHTMLPatientProblems += "<td valign='top'>" + count + "</td> ";

                                //rowHeight=17;
                                strCount = count + "";
                                //CurrentDF.formatString = "MM/DD/YYYY";
                                this.strHTMLPatientProblems += " <td valign='top' >" + prob_date.substring(0, 10) + "</td> ";
                                strCount = "";
                                this.strHTMLPatientProblems += " <td valign='top'  >" + prob_code.trim() + "</td> ";
                                strCount = "";
                                this.strHTMLPatientProblems += " <td valign='top' >" + this.generalOperation.ReplaceHTMLReservedWords(prob_desc.trim()) + " " + strPrimary + "</td> ";
                                strCount = "";
                                this.strHTMLPatientProblems += " <td valign='top' >" + this.generalOperation.ReplaceHTMLReservedWords(prob_comments) + "</td> ";
                                count++;
                                this.strHTMLPatientProblems += " </tr> ";
                                sno++;
                            }

                        }
                        sno = 1;
                        for (i = 0; i < this.acPatProblem.length; i++) {
                            prob_date = (this.acPatProblem[i].prob_date != null && this.acPatProblem[i].prob_date != "01/01/1900") ? this.acPatProblem[i].prob_date : "";
                            prob_code = (this.acPatProblem[i].diag_code != null) ? this.acPatProblem[i].diag_code : "";
                            prob_desc = (this.acPatProblem[i].diag_description != null) ? this.acPatProblem[i].diag_description : "";
                            prob_comments = (this.acPatProblem[i].comments != null) ? this.acPatProblem[i].comments : "";

                            if (this.acPatProblem[i].date_created != null && this.acPatProblem[i].date_created != "")
                                created_date = this.dateTimeUtil.getDateTimeString(this.acPatProblem[i].date_created.toString(), DateTimeFormat.DATEFORMAT_MM_DD_YYYY);
                            else
                                created_date = this.dateTimeUtil.getCurrentDateTimeStringWithFormat(DateTimeFormat.DATEFORMAT_MM_DD_YYYY);

                            visit_date = this.dateTimeUtil.getDateTimeString(this.acReportHeader[0].visit_date, DateTimeFormat.DATEFORMAT_MM_DD_YYYY);
                            created_date = prob_date;

                            if (this.dateTimeUtil.getDateTimeFromString(created_date, DateTimeFormat.DATEFORMAT_MM_DD_YYYY) < this.dateTimeUtil.getDateTimeFromString(visit_date, DateTimeFormat.DATEFORMAT_MM_DD_YYYY)) {
                                if (sno == 1) {
                                    this.strHTMLPatientProblems += "<tr>" +
                                        " <td  class='styleModuleSubHeader' colspan='5' >Current Problems</td></tr> ";
                                }
                                if (this.acPatProblem[i].primary_diag == true) {
                                    strPrimary = "<span class='styleNormalBold'>(Primary Diagnose)</span>";
                                }
                                else {
                                    strPrimary = "";
                                }

                                if (count > 0 && count % 2 == 0)
                                    this.strHTMLPatientProblems += "<tr class='styleAlternateRowColor'>";
                                else
                                    this.strHTMLPatientProblems += "<tr>";
                                this.strHTMLPatientProblems += "<td valign='top'>" + count + "</td> ";

                                //rowHeight=17;
                                strCount = count + "";
                                //CurrentDF.formatString = "MM/DD/YYYY";
                                this.strHTMLPatientProblems += " <td valign='top' >" + prob_date.substring(0, 10) + "</td> ";
                                strCount = "";
                                this.strHTMLPatientProblems += " <td valign='top'  >" + prob_code.trim() + "</td> ";
                                strCount = "";
                                this.strHTMLPatientProblems += " <td valign='top'>" + this.generalOperation.ReplaceHTMLReservedWords(prob_desc) + " " + strPrimary + "</td> ";
                                strCount = "";
                                this.strHTMLPatientProblems += " <td valign='top' >" + this.generalOperation.ReplaceHTMLReservedWords(prob_comments) + "</td> ";
                                count++;
                                this.strHTMLPatientProblems += " </tr> ";
                                sno++;
                            }

                        }
                    }
                    this.strHTMLPatientProblems += " </tbody></table>";//<hr align='left' width='750'>";
                    this.strHtmlString += this.strHTMLPatientProblems;
                    this.strHtmlString += this.strModuleGap;
                }
            }
        }
        catch (e) {
            this.logMessage.log("Problems-HTML" + e);
        }
    }
    Surgeries() {
        try {
            this.strHTMLPatientSurgery = "";
            var colCount = 7;
            if (this.acPatSurgery != null && this.acPatSurgery.length > 0) {

                this.strHTMLPatientSurgery = "<table width='98%' class='tableMain'><tbody>" +
                    "<tr >" +
                    "<th colspan='5'>Surgeries</th>" +
                    "</tr>" +
                    "<tr class='styleModuleSubHeader'>" +
                    " 	<td width='10' valign='top'></td>" +
                    " 	<td width='60' valign='top' >Date</td> " +
                    " 	<td width='65' valign='top'  >Code</td> " +
                    " 	<td  valign='top' >Description</td> " +
                    " 	<td  valign='top'  >Comments</td> " +
                    "</tr>";

                var strCount: String;

                for (var i = 0; i < this.acPatSurgery.length; i++) {
                    var count = i + 1;
                    if (count > 0 && count % 2 == 0)
                        this.strHTMLPatientSurgery += "<tr class='styleAlternateRowColor'>";
                    else
                        this.strHTMLPatientSurgery += "<tr>";

                    this.strHTMLPatientSurgery += "<td valign='top'>" + count + "</td> ";

                    if (this.acPatSurgery[i].procedure_date != null && this.acPatSurgery[i].procedure_date != "01/01/1900") {
                        this.strHTMLPatientSurgery += " <td valign='top'>" + this.acPatSurgery[i].procedure_date + "</td> ";
                    }

                    this.strHTMLPatientSurgery += " <td valign='top'>" + this.acPatSurgery[i].procedure_code + "</td> ";

                    this.strHTMLPatientSurgery += " <td valign='top'>" + this.acPatSurgery[i].description + "</td> ";

                    if (this.acPatSurgery[i].comments != null) {
                        this.strHTMLPatientSurgery += " <td valign='top'>" + this.generalOperation.ReplaceHTMLReservedWords(this.acPatSurgery[i].comments) + "</td> ";
                    } else {
                        this.strHTMLPatientSurgery += " <td  valign='top'></td> ";
                    }

                    this.strHTMLPatientSurgery += "</tr>";
                }


                this.strHTMLPatientSurgery += " </tbody></table>";

                this.strHtmlString += this.strHTMLPatientSurgery;
                this.strHtmlString += this.strModuleGap;
            }
        }
        catch (e) {
            this.logMessage.log("Surgeries-HTML" + e);
        }
    }
    Procedures() {
        try {
            this.strHTMLPatientSurgery = "";
            var colCount = 7;
            if (this.acPatProcedure != null && this.acPatProcedure.length > 0) {

                this.strHTMLPatientSurgery = "<table width='98%' class='tableMain'><tbody>" +
                    "<tr >" +
                    "<th colspan='5'>Procedure</th>" +
                    "</tr>" +
                    "<tr class='styleModuleSubHeader'>" +
                    " 	<td width='10' valign='top'></td>" +
                    " 	<td width='60' valign='top' >Date</td> " +
                    " 	<td width='65' valign='top'  >Code</td> " +
                    " 	<td  valign='top' >Description</td> " +
                    " 	<td  valign='top'  >Comments</td> " +
                    "</tr>";

                var strCount: String;

                for (var i = 0; i < this.acPatProcedure.length; i++) {
                    var count = i + 1;
                    if (count > 0 && count % 2 == 0)
                        this.strHTMLPatientSurgery += "<tr class='styleAlternateRowColor'>";
                    else
                        this.strHTMLPatientSurgery += "<tr>";

                    this.strHTMLPatientSurgery += "<td valign='top'>" + count + "</td> ";

                    if (this.acPatProcedure[i].procedure_date != null && this.acPatProcedure[i].procedure_date != "01/01/1900") {
                        this.strHTMLPatientSurgery += " <td valign='top'>" + this.acPatProcedure[i].procedure_date + "</td> ";
                    }

                    this.strHTMLPatientSurgery += " <td valign='top'>" + this.acPatProcedure[i].procedure_code + "</td> ";

                    this.strHTMLPatientSurgery += " <td valign='top'>" + this.acPatProcedure[i].description + "</td> ";

                    if (this.acPatProcedure[i].comments != null) {
                        this.strHTMLPatientSurgery += " <td valign='top'>" + this.generalOperation.ReplaceHTMLReservedWords(this.acPatProcedure[i].comments) + "</td> ";
                    } else {
                        this.strHTMLPatientSurgery += " <td  valign='top'></td> ";
                    }

                    this.strHTMLPatientSurgery += "</tr>";
                }


                this.strHTMLPatientSurgery += " </tbody></table>";

                this.strHtmlString += this.strHTMLPatientSurgery;
                this.strHtmlString += this.strModuleGap;
            }
        }
        catch (e) {
            this.logMessage.log("Procesures-HTML" + e);
        }
    }
    Immunization() {
        try {
            this.strHTMLPatientImmunizations = "";
            if (this.acPatImmunization != null && this.acPatImmunization.length > 0) {
                this.strHTMLPatientImmunizations = " <table width='98%' class='tableMain'><tbody>" +
                    " <tr><th colspan='4'>Immunizations / Injections</th></tr>  " +
                    " <tr class='styleModuleSubHeader'>" +
                    " <td width='10' ></td> " +
                    " <td width='60' >Date</td> " +
                    " <td >Vaccine</td> " +
                    " <td >Type</td> " +
                    " </tr>";

                var i = 0;
                var rowHeight = 17;
                var count_current = 1;
                var count_other = 1;
                var count = 0;

                var strCurrent: string = "";
                var strOther: string = "";
                var strHTMLImm: string = "";
                var strType: string = "";

                var row_current = 0;
                var row_other = 0;

                for (i = 0; i < this.acPatImmunization.length; i++) {

                    var created_date: Date;
                    if (this.acPatImmunization[i].datetime_administered != null) {
                        created_date = new Date(this.dateTimeUtil.getDateTimeString(this.acPatImmunization[i].datetime_administered, DateTimeFormat.DATEFORMAT_MM_DD_YYYY));
                    }
                    else
                        created_date = new Date(this.dateTimeUtil.getCurrentDateTimeStringWithFormat(DateTimeFormat.DATEFORMAT_MM_DD_YYYY));

                    var visit_date: Date = new Date(this.dateTimeUtil.getDateTimeString(this.acReportHeader[0].visit_date, DateTimeFormat.DATEFORMAT_MM_DD_YYYY));

                    strHTMLImm = "";
                    var strTradeName: String = this.acPatImmunization[i].trade_name == null ? "" : this.acPatImmunization[i].trade_name;
                    var strImmunizationName: String = this.acPatImmunization[i].immunization_name == null ? "" : this.acPatImmunization[i].immunization_name;
                    var strDate: String = (this.acPatImmunization[i].datetime_administered == "01/01/1900" || this.acPatImmunization[i].datetime_administered == null) ? "" : this.acPatImmunization[i].datetime_administered;

                    var strCVX: String = this.acPatImmunization[i].cvx_code == null ? "" : this.acPatImmunization[i].cvx_code;
                    var strDateTime: String = "";
                    if (strDate != "")
                        strDateTime = strDate;

                    if (this.acPatImmunization[i].entry_type != null && this.acPatImmunization[i].entry_type != "") {
                        if (this.acPatImmunization[i].entry_type.toString().toLowerCase() == "refused") {
                            strType = "Refused - " + this.acPatImmunization[i].reason_description;
                        }
                        else if (this.acPatImmunization[i].entry_type.toString().toLowerCase() == "historical") {
                            strType = "Historical - " + this.acPatImmunization[i].administered_code_description;
                        }
                        else if (this.acPatImmunization[i].entry_type.toString().toLowerCase() == "administered") {
                            if (this.acPatImmunization[i].completion_status_code.toString().toLowerCase() == "cp") {
                                strType = "Administered";
                            }
                            else if (this.acPatImmunization[i].completion_status_code.toString().toLowerCase() == "pa") {
                                strType = "Partially Administered";
                            }
                            else if (this.acPatImmunization[i].completion_status_code.toString().toLowerCase() == "na") {
                                strType = "Not Administered - " + this.acPatImmunization[i].reason_description;
                            }

                        }
                    }

                    if (this.acPatImmunization[i].chart_id == this.chartId) {
                        count = count_current
                        count_current++;
                    }
                    else if (created_date <= visit_date) {
                        count = count_other
                        count_other++;
                    }
                    else // do not display immunizatino of future date with respect to visit date. 
                    {
                        continue;
                    }

                    if (count > 0 && count % 2 == 0)
                        strHTMLImm += "<tr class='styleAlternateRowColor'>";
                    else
                        strHTMLImm += "<tr>";


                    strHTMLImm += " <td  valign='top'>" + count + "</td> ";

                    if (strDate != "") {
                        strHTMLImm += " <td valign='top'>" + strDate + "</td> ";
                    }
                    else {
                        strHTMLImm += " <td > </td> ";
                    }


                    if (strImmunizationName != "") {
                        strHTMLImm += " <td valign='top'>" + strImmunizationName;

                        if (strTradeName != "" || strCVX != "") {
                            strHTMLImm += "   (";

                            if (strTradeName != "") {
                                //strHTMLImm+= " <td style='width:332px;'><b>Trade Name:</b> "+strTradeName+"</td> ";
                                strHTMLImm += strTradeName;
                            }

                            if (strCVX != "") {
                                if (strTradeName != "") {
                                    strHTMLImm += "    ";
                                }
                                strHTMLImm += "CVX:" + strCVX;
                            }

                            strHTMLImm += ")";
                        }
                        strHTMLImm += "</td> ";
                    }
                    else {
                        strHTMLImm += " <td  > </td> ";
                    }

                    if (strType != "") {
                        strHTMLImm += " <td  valign='top'>" + strType + "</td> ";
                    }
                    else {
                        strHTMLImm += " <td > </td> ";
                    }


                    strHTMLImm += " </tr> ";


                    if (this.acPatImmunization[i].chart_id == this.chartId) {
                        strCurrent += strHTMLImm;
                        row_current++;
                    }
                    else if (created_date <= visit_date) {
                        strOther += strHTMLImm;
                        row_other++;
                    }

                }//loop end
                if (strCurrent != "") {
                    strCurrent = " <tr  class='styleModuleSubHeader'>	 "
                        + " <td colspan='4' valign='top' >Current Immunizations</td> "
                        + " </tr> "
                        + strCurrent;
                }
                else {
                    strCurrent = " <tr  class='styleModuleSubHeader'>	 "
                        + " <td colspan='4' valign='top' >Current Immunizations</td> "
                        + " </tr> "
                        + " <tr  >	 "
                        + " <td></td><td colspan='3' align='left' valign='top' >No Immunization is administred in current visit.</td> "
                        + " </tr> ";
                }

                if (strOther != "") {
                    strOther = " <tr   class='styleModuleSubHeader'>	 "
                        + " <td colspan='4' valign='top' >Other Immunizations</td> "
                        + " </tr> "
                        + strOther;

                }
                this.strHTMLPatientImmunizations += strCurrent + strOther;

                this.strHTMLPatientImmunizations += " </tbody></table>";//<hr align='left' width='750'>";
                this.strHtmlString += this.strHTMLPatientImmunizations;
                this.strHtmlString += this.strModuleGap;
            }
        }
        catch (e) {
            this.logMessage.log("Immunizations-HTML" + e);
        }
    }
    SocialHX() {
        try {
            this.strHTMLPatientSocialHistory = "";
            //if (this.acSocialHist != null && this.acSocialHist.length > 0) {
            if (this.acSocialHist) {
                var strOccupation: string = this.acSocialHist.occupation == null ? "" : this.acSocialHist.occupation;
                this.marital_status = this.acSocialHist.marital_status == null ? "" : this.acSocialHist.marital_status;
                var strEducation: string = this.acSocialHist.education == null ? "" : this.acSocialHist.education;
                var strSexualOrientation: string = this.acSocialHist.sexual_orientation == null ? "" : this.acSocialHist.sexual_orientation;
                var strChildren: string = this.acSocialHist.children == null ? "" : this.acSocialHist.children;

                var strTobaccoStatus: string = this.acSocialHist.smoking_status == null ? "" : this.acSocialHist.smoking_status;
                var strPacksPerDay: string = this.acSocialHist.packs_per_day == null ? "" : this.acSocialHist.packs_per_day;
                var strTobaccoType: string = this.acSocialHist.tobacco_type == null ? "" : this.acSocialHist.tobacco_type;
                var strYear: string = this.acSocialHist.year_started == null ? "" : this.acSocialHist.year_started;
                var strStartedQuite: string;
                if (strTobaccoStatus == "Former smoker (CDC-3)")
                    strStartedQuite = "Year Quit:&nbsp;";
                else if (strStartedQuite != "")
                    strStartedQuite = "Year Started:&nbsp;";

                var strComments: string = this.acSocialHist.comment == null ? "" : this.acSocialHist.comment;

                var strAlcoholUse: string = (this.acSocialHist.alcohol_per_day != "" && this.acSocialHist.alcohol_per_day != null) ? this.acSocialHist.alcohol_per_day : "No";
                var strCaffeineUse: string = (this.acSocialHist.caffeine_per_day != "" && this.acSocialHist.caffeine_per_day != null) ? this.acSocialHist.caffeine_per_day : "No";

                var strExercise: string = this.acSocialHist.exercise == null ? "" : this.acSocialHist.exercise;
                var strDrugUse: string = this.acSocialHist.drug_use == null ? "" : this.acSocialHist.drug_use;
                var strSeatBelt: string = this.acSocialHist.seatbelt == null ? "" : this.acSocialHist.seatbelt;
                var strExposure: string = this.acSocialHist.exposure == null ? "" : this.acSocialHist.exposure;

                var strAgeAtMenarche: string = this.acSocialHist.age_at_menarche == null ? "" : this.acSocialHist.age_at_menarche;
                var strCycle: string = this.acSocialHist.cycle == null ? "" : this.acSocialHist.cycle;
                var strFlow: string = this.acSocialHist.flow == null ? "" : this.acSocialHist.flow;
                var strGravida: string = this.acSocialHist.gravida == null ? "" : this.acSocialHist.gravida;
                var strPregnent: string = this.acSocialHist.pregnant == true ? "YES" : "";
                var strEDD: string = (this.acSocialHist.edd == null || this.acSocialHist.edd == "01/01/1900" || this.acSocialHist.edd == "01/01/1970") ? "" : this.acSocialHist.edd;
                var strLMP: string = (this.acSocialHist.lmp == null || this.acSocialHist.lmp == "01/01/1900" || this.acSocialHist.lmp == "01/01/1970") ? "" : this.acSocialHist.lmp;
                var strPara: string = (this.acSocialHist.dysmenomhea != "" && this.acSocialHist.dysmenomhea != null) ? this.acSocialHist.dysmenomhea : "";
                var strDysmenomhea: string = (this.acSocialHist.dysmenomhea != "" && this.acSocialHist.dysmenomhea != null) ? "YES " : "";

                var colspan = 5;
                var rowData: string = "";
                if (this.marital_status != "" && strOccupation != "" && strEducation != "" && strSexualOrientation != "" && strChildren != "") {
                    colspan = 0;
                }
                var no = 0;

                this.strHTMLPatientSocialHistory = " <table width='98%' class='tableMain'><tbody><tr><th colspan='4'>Social History</th></tr> ";

                //***** Personal Information
                if (this.marital_status != "" || strOccupation != "" || strEducation != "" || strSexualOrientation != "" || strChildren != "") {
                    no = 0;
                    this.strHTMLPatientSocialHistory += " <tr>" +
                        " <td colspan='4'  class='styleModuleSubHeader'>Personal Information:</td> " +
                        " </tr> ";


                    this.strHTMLPatientSocialHistory += "<tr>";

                    if (this.marital_status != "") {
                        if (no > 0 && no % 4 == 0) {
                            this.strHTMLPatientSocialHistory += "</tr><tr>";
                        }
                        this.strHTMLPatientSocialHistory += " <td valign='top'> " +
                            " <span class='styleNormalBold'>Marital Status:&nbsp;</span><span class='styleNormal'>" + this.marital_status + "</span>" +
                            " </td>";
                        no++;
                    }
                    if (strSexualOrientation != "") {
                        if (no > 0 && no % 4 == 0) {
                            this.strHTMLPatientSocialHistory += "</tr><tr>";
                        }
                        this.strHTMLPatientSocialHistory += " <td valign='top'> " +
                            " <span class='styleNormalBold'>Sexual Orientation:&nbsp;</span><span class='styleNormal'>" + strSexualOrientation + "</span>" +
                            " </td>";
                        no++;
                    }
                    if (strChildren != "") {
                        if (no > 0 && no % 4 == 0) {
                            this.strHTMLPatientSocialHistory += "</tr><tr>";
                        }
                        this.strHTMLPatientSocialHistory += " <td valign='top'> " +
                            " <span class='styleNormalBold'>Children:&nbsp;</span><span class='styleNormal'>" + strChildren + "</span>" +
                            " </td>";
                        no++;
                    }

                    if (strEducation != "") {
                        if (no > 0 && no % 4 == 0) {
                            this.strHTMLPatientSocialHistory += "</tr><tr>";
                        }
                        this.strHTMLPatientSocialHistory += " <td valign='top'> " +
                            " <span class='styleNormalBold'>Education:&nbsp;</span><span class='styleNormal'>" + strEducation + "</span>" +
                            " </td>";
                        no++;
                    }

                    if (strOccupation != "") {
                        if (no > 0 && no % 4 == 0) {
                            this.strHTMLPatientSocialHistory += "</tr><tr>";
                        }

                        this.strHTMLPatientSocialHistory += " <td valign='top'> " +
                            " <span class='styleNormalBold'>Occupation:&nbsp;</span><span class='styleNormal'>" + strOccupation + "</span>" +
                            " </td>";
                        no++;
                    }

                    if (no > 0 && no % 4 != 0) {
                        while (no % 4 != 0) {
                            this.strHTMLPatientSocialHistory += "<td valign='top'></td>";
                            no++;
                        }
                    }

                    this.strHTMLPatientSocialHistory += " </tr> ";
                }
                //**************************
                rowData = "";
                //***** Tobacco Use
                if (strTobaccoStatus != "" || strPacksPerDay != "" || strTobaccoType != "" || (strYear != "" && strStartedQuite != "")) {
                    no = 0;
                    this.strHTMLPatientSocialHistory += " <tr >" +
                        " <td colspan='4'  class='styleModuleSubHeader'>Tobacco Use:</td> " +
                        " </tr> ";

                    this.strHTMLPatientSocialHistory += "<tr>";
                    if (strTobaccoStatus != "") {
                        if (no > 0 && no % 4 == 0) {
                            this.strHTMLPatientSocialHistory += "</tr><tr>";
                        }

                        this.strHTMLPatientSocialHistory += " <td valign='top'> " +
                            " <span class='styleNormalBold'>Status:&nbsp;</span><span class='styleNormal'>" + strTobaccoStatus + "</span>" +
                            " </td>";
                        no++;
                    }

                    if (strTobaccoType != "") {
                        if (no > 0 && no % 4 == 0) {
                            this.strHTMLPatientSocialHistory += "</tr><tr>";
                        }

                        this.strHTMLPatientSocialHistory += " <td valign='top'> " +
                            " <span class='styleNormalBold'>Type:&nbsp;</span><span class='styleNormal'>" + strTobaccoType + "</span>" +
                            " </td>";
                        no++;
                    }

                    if (strPacksPerDay != "") {
                        if (no > 0 && no % 4 == 0) {
                            this.strHTMLPatientSocialHistory += "</tr><tr>";
                        }

                        this.strHTMLPatientSocialHistory += " <td valign='top'> " +
                            " <span class='styleNormalBold'>Pack(s)/Day:&nbsp;</span><span class='styleNormal'>" + strPacksPerDay + "</span>" +
                            " </td>";
                        no++;
                    }


                    if (strStartedQuite != "" && strYear != "") {
                        if (no > 0 && no % 4 == 0) {
                            this.strHTMLPatientSocialHistory += "</tr><tr>";
                        }

                        this.strHTMLPatientSocialHistory += " <td valign='top'> " +
                            " <span class='styleNormalBold'>" + strStartedQuite + ":&nbsp;</span><span class='styleNormal'>" + strYear + "</span>" +
                            " </td>";
                        no++;
                    }

                    if (no > 0 && no % 4 != 0) {
                        while (no % 4 != 0) {
                            this.strHTMLPatientSocialHistory += "<td  ></td>";
                            no++;
                        }
                    }

                    this.strHTMLPatientSocialHistory += " </tr>	 ";
                }
                rowData = "";
                //***** Alcohol and Caffeine Use
                if (strAlcoholUse != "" || strCaffeineUse != "") {
                    no = 0;
                    this.strHTMLPatientSocialHistory += " <tr >" +
                        " <td class='styleModuleSubHeader' colspan='4'>Alcohol and Caffeine Use:</td> " +
                        " </tr> ";

                    this.strHTMLPatientSocialHistory += "<tr>";

                    if (strAlcoholUse != "") {
                        if (no > 0 && no % 4 == 0) {
                            this.strHTMLPatientSocialHistory += "</tr><tr>";
                        }

                        this.strHTMLPatientSocialHistory += " <td valign='top'> " +
                            " <span class='styleNormalBold'>Alcohol Use:&nbsp;</span><span class='styleNormal'>" + strAlcoholUse + "</span>" +
                            " </td>";
                        no++;
                    }
                    if (strCaffeineUse != "") {
                        if (no > 0 && no % 4 == 0) {
                            this.strHTMLPatientSocialHistory += "</tr><tr>";
                        }

                        this.strHTMLPatientSocialHistory += " <td valign='top'> " +
                            " <span class='styleNormalBold'>Caffeine Use:&nbsp;</span><span class='styleNormal'>" + strCaffeineUse + "</span>" +
                            " </td>";
                        no++;
                    }

                    if (no > 0 && no % 4 != 0) {
                        while (no % 4 != 0) {
                            this.strHTMLPatientSocialHistory += "<td    ></td>";
                            no++;
                        }
                    }

                    this.strHTMLPatientSocialHistory += " </tr>	 ";
                }
                //**************************
                rowData = "";
                //***** Risk Factor
                if (strExercise != "" || strDrugUse != "" || strSeatBelt != "" || strExposure != "") {
                    no = 0;
                    this.strHTMLPatientSocialHistory += " <tr >" +
                        " <td class='styleModuleSubHeader' colspan='4'>Risk Factor:</td> " +
                        " </tr> ";

                    this.strHTMLPatientSocialHistory += "<tr>";

                    if (strExercise != "") {
                        if (no > 0 && no % 4 == 0) {
                            this.strHTMLPatientSocialHistory += "</tr><tr>";
                        }

                        this.strHTMLPatientSocialHistory += " <td valign='top'> " +
                            " <span class='styleNormalBold'>Exercise:&nbsp;</span><span class='styleNormal'>" + strExercise + "</span>" +
                            " </td>";
                        no++;
                    }
                    if (strDrugUse != "") {
                        if (no > 0 && no % 4 == 0) {
                            this.strHTMLPatientSocialHistory += "</tr><tr>";
                        }

                        this.strHTMLPatientSocialHistory += " <td valign='top'> " +
                            " <span class='styleNormalBold'>Drug Use:&nbsp;</span><span class='styleNormal'>" + strDrugUse + "</span>" +
                            " </td>";
                        no++;
                    }
                    if (strSeatBelt != "") {
                        if (no > 0 && no % 4 == 0) {
                            this.strHTMLPatientSocialHistory += "</tr><tr>";
                        }

                        this.strHTMLPatientSocialHistory += " <td valign='top'> " +
                            " <span class='styleNormalBold'>Seatbelt:&nbsp;</span><span class='styleNormal'>" + strSeatBelt + "</span>" +
                            " </td>";
                        no++;
                    }
                    if (strExposure != "") {
                        if (no > 0 && no % 4 == 0) {
                            this.strHTMLPatientSocialHistory += "</tr><tr>";
                        }

                        this.strHTMLPatientSocialHistory += " <td valign='top'> " +
                            " <span class='styleNormalBold'>Exposure:&nbsp;</span><span class='styleNormal'>" + strExposure + "</span>" +
                            " </td>";
                        no++;
                    }

                    if (no > 0 && no % 4 != 0) {
                        while (no % 4 != 0) {
                            this.strHTMLPatientSocialHistory += "<td  ></td>";
                            no++;
                        }
                    }

                    this.strHTMLPatientSocialHistory += " </tr>	 ";

                }
                rowData = "";
                //**********************************************************
                // OB/GYN
                if (strAgeAtMenarche != "" || strCycle != "" || strFlow != "" || strGravida != "" || strPregnent != "" || strEDD != "" || strLMP != "" || strDysmenomhea != "") {

                    no = 0;
                    this.strHTMLPatientSocialHistory += " <tr >" +
                        " <td class='styleModuleSubHeader' colspan='4'>OB/GYN History:</td> " +
                        " </tr> ";

                    this.strHTMLPatientSocialHistory += "<tr>";
                    if (strLMP != "") {
                        if (no > 0 && no % 4 == 0) {
                            this.strHTMLPatientSocialHistory += "</tr><tr>";
                        }

                        this.strHTMLPatientSocialHistory += " <td valign='top'> " +
                            " <span class='styleNormalBold'>LMP:&nbsp;</span><span class='styleNormal'>" + strLMP + "</span>" +
                            " </td>";
                        no++;
                    }
                    if (strAgeAtMenarche != "") {
                        if (no > 0 && no % 4 == 0) {
                            this.strHTMLPatientSocialHistory += "</tr><tr>";
                        }

                        this.strHTMLPatientSocialHistory += " <td valign='top'> " +
                            " <span class='styleNormalBold'>Age at Menarche:&nbsp;</span><span class='styleNormal'>" + strAgeAtMenarche + "</span>" +
                            " </td>";
                        no++;
                    }
                    if (strCycle != "") {
                        if (no > 0 && no % 4 == 0) {
                            this.strHTMLPatientSocialHistory += "</tr><tr>";
                        }

                        this.strHTMLPatientSocialHistory += " <td valign='top'> " +
                            " <span class='styleNormalBold'>Cycle:&nbsp;</span><span class='styleNormal'>" + strCycle + "</span>" +
                            " </td>";
                        no++;
                    }

                    if (strFlow != "") {
                        if (no > 0 && no % 4 == 0) {
                            this.strHTMLPatientSocialHistory += "</tr><tr>";
                        }

                        this.strHTMLPatientSocialHistory += " <td valign='top'> " +
                            " <span class='styleNormalBold'>Flow:&nbsp;</span><span class='styleNormal'>" + strFlow + "</span>" +
                            " </td>";
                        no++;
                    }
                    if (strGravida != "") {
                        if (no > 0 && no % 4 == 0) {
                            this.strHTMLPatientSocialHistory += "</tr><tr>";
                        }

                        this.strHTMLPatientSocialHistory += " <td    > " +
                            " <span class='styleNormalBold'>Gravida:&nbsp;</span><span class='styleNormal'>" + strGravida + "</span>" +
                            " </td>";
                        no++;
                    }
                    if (strPregnent != "") {
                        if (no > 0 && no % 4 == 0) {
                            this.strHTMLPatientSocialHistory += "</tr><tr>";
                        }

                        this.strHTMLPatientSocialHistory += " <td valign='top'> " +
                            " <span class='styleNormalBold'>Pregnent:&nbsp;</span><span class='styleNormal'>" + strPregnent + "</span>" +
                            " </td>";
                        no++;
                    }
                    if (strEDD != "") {
                        if (no > 0 && no % 4 == 0) {
                            this.strHTMLPatientSocialHistory += "</tr><tr>";
                        }

                        this.strHTMLPatientSocialHistory += " <td valign='top'> " +
                            " <span class='styleNormalBold'>EDD:&nbsp;</span><span class='styleNormal'>" + strEDD + "</span>" +
                            " </td>";
                        no++;
                    }

                    if (strDysmenomhea != "") {
                        if (no > 0 && no % 4 == 0) {
                            this.strHTMLPatientSocialHistory += "</tr><tr>";
                        }

                        this.strHTMLPatientSocialHistory += " <td valign='top'> " +
                            " <span class='styleNormalBold'>Dysmenomhea:&nbsp;</span><span class='styleNormal'>" + strDysmenomhea + "</span>" +
                            " </td>";
                        no++;
                    }
                    if (strPara != "") {
                        if (no > 0 && no % 4 == 0) {
                            this.strHTMLPatientSocialHistory += "</tr><tr>";
                        }

                        this.strHTMLPatientSocialHistory += " <td valign='top'> " +
                            " <span class='styleNormalBold'>Dysmenomhea:&nbsp;</span><span class='styleNormal'>" + strPara + "</span>" +
                            " </td>";
                        no++;
                    }

                    if (no > 0 && no % 4 != 0) {
                        while (no % 4 != 0) {
                            this.strHTMLPatientSocialHistory += "<td valign='top'></td>";
                            no++;
                        }
                    }

                    this.strHTMLPatientSocialHistory += " </tr>	 ";

                }
                if (strComments != "") {
                    this.strHTMLPatientSocialHistory += " <tr >" +
                        " <td class='styleModuleSubHeader' colspan='4'>Comments:</td> " +
                        " </tr> " +
                        " <tr>" +
                        "<td colspan='4' align='left'><span class='styleNormal'> " + this.generalOperation.ReplaceAll(this.generalOperation.ReplaceHTMLReservedWords(strComments), "\n", "<br>") + "</span></td></tr> ";
                }

                this.strHTMLPatientSocialHistory += "</tbody></table>";
                this.strHtmlString += this.strHTMLPatientSocialHistory;
                this.strHtmlString += this.strModuleGap;
            }
        }
        catch (e) {
            this.logMessage.log("SocialHX-HTML" + e);
        }
    }
    FamilyHX() {
        try {
            this.strHTMLPatientFamilyHistory = "";
            {
                if (this.acFamilyHist != null && this.acFamilyHist.length > 0) {
                    this.strHTMLPatientFamilyHistory = "<table width='98%' class='tableMain'> " +
                        "<tbody>" +
                        "<tr>" +
                        "<th colspan='5'>Family History</th>" +
                        "</tr>" +
                        "<tr class='styleModuleSubHeader'>" +
                        "	<td width='10'></td>" +
                        "	<td width='110' valign='center'>Relation</td>" +
                        "	<td width='70' valign='center'>Code</td>" +
                        "	<td valign='center'>Description</td>" +
                        " 	<td valign='center'>Comments</td>" +
                        "</tr>";

                    var i = 0;
                    var count = 1;
                    for (i = 0; i < this.acFamilyHist.length; i++) {
                        if (count > 0 && count % 2 == 0)
                            this.strHTMLPatientFamilyHistory += "<tr class='styleAlternateRowColor'>";
                        else
                            this.strHTMLPatientFamilyHistory += "<tr>";

                        this.strHTMLPatientFamilyHistory += " <td valign='top'>" + count + "</td> ";
                        var strCount: String = "";
                        //rowHeight=17;

                        //strCount=count+ ") ";										
                        if (this.acFamilyHist[i].relation != null) {
                            //strCount="";
                            this.strHTMLPatientFamilyHistory += " <td valign='top'>" + this.acFamilyHist[i].relation + "</td> ";
                        }

                        this.strHTMLPatientFamilyHistory += " <td valign='top'>" + this.acFamilyHist[i].icd_code + "</td> ";

                        this.strHTMLPatientFamilyHistory += " <td valign='top'>" + this.generalOperation.ReplaceHTMLReservedWords(this.acFamilyHist[i].description) + "</td> ";

                        if (this.acFamilyHist[i].comment != null) {
                            this.strHTMLPatientFamilyHistory += " <td valign='top'>" + this.generalOperation.ReplaceHTMLReservedWords(this.acFamilyHist[i].comment) + "</td> ";
                        }
                        this.strHTMLPatientFamilyHistory += "</tr>";
                        count++;
                    }

                    this.strHTMLPatientFamilyHistory += "</tbody></table>";//<hr align='left'  width='750'>";
                    this.strHtmlString += this.strHTMLPatientFamilyHistory;
                    this.strHtmlString += this.strModuleGap;
                }
            }
        }
        catch (e) {
            this.logMessage.log("FamilyHX-HTML" + e);
        }
    }
    Prescription() {
        try {
            this.strHTMLPatientMedication = "";

            //if(this.lookupList.UserRights.ViewMedication){
            this.strHTMLPatientMedication = " <table width='98%' class='tableMain'><tbody> " +
                " <tr><th colspan='3'>Medications</th></tr>";

            var Currentexist: Boolean = false;
            var Todayexist: Boolean = false;

            if (this.acPatPrescription != null && this.acPatPrescription.length > 0) {

                var strMedicineName: string = "";
                var strSig: string = "";
                var strStrength: string = "";
                var i = 0;
                var sno = 1;
                var prescriber: string = "";

                // Current Medication
                this.acPatPrescription = this.generalOperation.filterArray(this.acPatPrescription, "archive", "N");
                for (; i < this.acPatPrescription.length; i++) {
                    if (this.acPatPrescription[i].start_date == this.acReportHeader[0].visit_date) {
                        //continue;	
                        Todayexist = true;

                        strMedicineName = this.acPatPrescription[i].drug_info == null ? "" : this.acPatPrescription[i].drug_info;

                        strSig = this.generalOperation.ReplaceHTMLReservedWords(this.acPatPrescription[i].sig_text != null ? this.acPatPrescription[i].sig_text : "");

                        if (strMedicineName != "" || strSig != "") {
                            if (sno == 1) {
                                this.strHTMLPatientMedication += "<tr >" +
                                    "<td class='styleModuleSubHeader' colspan='3'>Prescribed At This Visit:</td>" +
                                    "</tr>";
                            }

                            if (prescriber != this.acPatPrescription[i].provider_name) {
                                prescriber = this.acPatPrescription[i].provider_name;

                                this.strHTMLPatientMedication += "<tr >" +
                                    "	<td colspan='3' ><span class='styleNormalBold'>Prescriber : " + prescriber + "</span></td>" +
                                    "</tr>";


                                sno = 1;
                            }

                            if (sno > 0 && sno % 2 == 0)
                                this.strHTMLPatientMedication += "<tr class='styleAlternateRowColor'>";
                            else
                                this.strHTMLPatientMedication += "<tr>";

                            this.strHTMLPatientMedication += "<td width='10'><span class='styleNormal'>" + sno + "</span></td>" +
                                "<td width='60'><span class='styleNormal'>" + this.acPatPrescription[i].start_date + "</span></td>" +
                                "<td valign='top'><span class='styleNormalBold'>" + this.generalOperation.ReplaceHTMLReservedWords(strMedicineName) + "</span><span class='styleNormal'> " + strSig + "</span></td>" +
                                "</tr>  ";

                            sno++;
                        }
                    }
                }

                prescriber = "";
                sno = 1;
                // Today's Medication
                i = 0;

                for (; i < this.acPatPrescription.length; i++) {
                    if (this.acPatPrescription[i].start_date != this.acReportHeader[0].visit_date) {
                        //continue;	
                        Currentexist = true;

                        strMedicineName = this.acPatPrescription[i].drug_info == null ? "" : this.acPatPrescription[i].drug_info;

                        strSig = this.generalOperation.ReplaceHTMLReservedWords(this.acPatPrescription[i].sig_text != null ? this.acPatPrescription[i].sig_text : "");

                        if (strMedicineName != "" || strSig != "") {
                            if (sno == 1) {
                                this.strHTMLPatientMedication += "<tr >" +
                                    "<td class='styleModuleSubHeader' colspan='3'>Current Medications:</td>" +
                                    "</tr>";
                            }

                            if (prescriber != this.acPatPrescription[i].provider_name) {
                                prescriber = this.acPatPrescription[i].provider_name;

                                this.strHTMLPatientMedication += "<tr >" +
                                    "	<td colspan='3' ><span class='styleNormalBold'>Prescriber : " + prescriber + "</span></td>" +
                                    "</tr>";

                                sno = 1;
                            }

                            if (sno > 0 && sno % 2 == 0)
                                this.strHTMLPatientMedication += "<tr class='styleAlternateRowColor'>";
                            else
                                this.strHTMLPatientMedication += "<tr>";

                            this.strHTMLPatientMedication += "<td width='10'><span class='styleNormal'>" + sno + "</span></td>" +
                                "<td width='60'><span class='styleNormal'>" + this.acPatPrescription[i].start_date + "</span></td>" +
                                "<td valign='top'><span class='styleNormalBold'>" + this.generalOperation.ReplaceHTMLReservedWords(strMedicineName) + "</span><span class='styleNormal'> " + strSig + "</span></td>" +
                                "</tr>  ";

                            sno++;
                        }
                    }
                }

            }
            else {
                Currentexist = false;
                Todayexist = false;
            }

            if (Currentexist == false && Todayexist == false) {
                this.strHTMLPatientMedication += "<tr >" +
                    "	<td colspan='3' valign='top'><span class='styleNormal'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;On no meds.</span></td>" +
                    "</tr>";
            }
            this.strHTMLPatientMedication += "</tbody></table>";
            this.strHtmlString += this.strHTMLPatientMedication;
            this.strHtmlString += this.strModuleGap;
            //}
        }
        catch (e) {
            this.logMessage.log("Prescription-HTML" + e);
        }
    }
    Allergies() {
        try {
            this.strHTMLPatientAllergies = "";
            if (this.acPatAllergies != null && this.acPatAllergies.length > 0) {
                this.strHTMLPatientAllergies = " <table width='98%' class='tableMain'> " +
                    "<tbody  >" +
                    "<tr>" +
                    "<th colspan='5'>Allergies</th>" +
                    "</tr>" +
                    "<tr class='styleModuleSubHeader'>" +
                    "	<td class='styleModuleSubHeader' width='10'></td>" +
                    "	<td class='styleModuleSubHeader' width='60' valign='center'>Date</td>" +
                    "	<td class='styleModuleSubHeader' valign='center'>Allergy</td>" +
                    "	<td class='styleModuleSubHeader' width='100' valign='center'>Concept Type</td>" +
                    " 	<td class='styleModuleSubHeader' width='100' valign='center'>Severity</td>" +
                    "</tr>";
                var i = 0;
                var count = 1;

                for (i = 0; i < this.acPatAllergies.length; i++) {
                    var space: String = "  ";

                    var strAllergyName: string = this.acPatAllergies[i].description;
                    var strDate: string = (this.acPatAllergies[i].alergy_date != null && this.acPatAllergies[i].alergy_date != "01/01/1900") ? this.acPatAllergies[i].alergy_date : "";
                    var strConceptType: string = (this.acPatAllergies[i].allergy_concept_type != null) ? this.acPatAllergies[i].allergy_concept_type : "";
                    var strSeverity: string = (this.acPatAllergies[i].severity != null) ? this.acPatAllergies[i].severity : "";
                    //var strReactionType:String=objchartreport.acPatAllergies[i].type_of_reactions!=null ? objchartreport.acPatAllergies[i].type_of_reactions: "";
                    var strNotes: string = this.acPatAllergies[i].notes != null ? this.acPatAllergies[i].notes : "";

                    if (count > 0 && count % 2 == 0)
                        this.strHTMLPatientAllergies += "<tr class='styleAlternateRowColor'>";
                    else
                        this.strHTMLPatientAllergies += "<tr>";

                    this.strHTMLPatientAllergies += " <td valign='top'>" + count + "&nbsp;</td> " +
                        " <td valign='top'>" + strDate + "</td> " +
                        " <td valign='top'>" + this.generalOperation.ReplaceHTMLReservedWords(strAllergyName) + "</td> " +
                        " <td valign='top'>" + strConceptType + "</td>" +
                        " <td valign='top'>" + strSeverity + "</td> " +
                        " </tr> ";
                    var no = 0;


                    if (strNotes != "") {
                        if (count > 0 && count % 2 == 0)
                            this.strHTMLPatientAllergies += "<tr class='styleAlternateRowColor'>";
                        else
                            this.strHTMLPatientAllergies += "<tr>";

                        this.strHTMLPatientAllergies += "<td></td>";
                        this.strHTMLPatientAllergies += "<td coslpan='4' valign='top'><span class='styleNormalBold'>Notes:&nbsp;</span><span class='styleNormal'>" +
                            this.generalOperation.ReplaceAll(this.generalOperation.ReplaceHTMLReservedWords(strNotes), "\n", "<br>") + "</span></td></tr> ";
                    }
                    count++;
                }

                this.strHTMLPatientAllergies += " </tbody></table>";
                this.strHtmlString += this.strHTMLPatientAllergies;
                this.strHtmlString += this.strModuleGap;
            }
        }
        catch (e) {
            this.logMessage.log("Allergies-HTML" + e);
        }
    }
    ROS() {

        try {
            debugger;
            let strHTMLPatientROS: string = "";


            if (this.objROS != undefined) {
                if (this.objROS.entry_type.toLowerCase() == 'free_text') {

                    if (this.objROS.ros_detail != undefined && this.objROS.ros_detail != null && this.objROS.ros_detail != '') {
                        strHTMLPatientROS = "<table width='98%' class='tableMain'> <tbody>" +
                            "<tr>" +
                            "<th>Review Of Systems</th>" +
                            "</tr>" +
                            "<tr>" +
                            "<td>";
                        strHTMLPatientROS += "<span class='m-0 styleNormal'>" + this.generalOperation.ReplaceAll(this.generalOperation.ReplaceHTMLReservedWords(this.objROS.ros_detail), "\n", "<br>")
                            + "</span>";
                        strHTMLPatientROS += "</td></tr></tbody></table>";
                        this.strHtmlString += strHTMLPatientROS;
                        this.strHtmlString += this.strModuleGap;
                    }
                }
                else if (this.objROS.entry_type.toLowerCase() == 'dynamic_template') {

                    if (this.acPatROSDynamicDisplayModel != null && this.acPatROSDynamicDisplayModel.length > 0) {
                        let lstLevel1: Array<any> = new ListFilterPipe().transform(this.acPatROSDynamicDisplayModel, 'level', 1);
                        strHTMLPatientROS = "<table  width='98%' class='tableMain'> <tbody>" +
                            "<tr>" +
                            "<th>Review Of Systems</th>" +
                            "</tr>" +
                            "<tr>" +
                            "<td>";

                        lstLevel1.forEach(level1 => {


                            strHTMLPatientROS += `<p class='pr-1  m-0'><span class='styleNormalBold'>` + level1.heading + `:&nbsp;&nbsp;</span>`;
                            if (level1.value != undefined && level1.value != "") {
                                strHTMLPatientROS += "<span class='m-0 px-1 styleNormal'>" + level1.value + "</span>";
                            }
                            strHTMLPatientROS += `</p>`;
                            let lstLevel2: Array<any> = new ListFilterPipe().transform(this.acPatROSDynamicDisplayModel, 'parent_id', level1.id);
                            lstLevel2.forEach(level2 => {
                                strHTMLPatientROS += `<p class='pl-2  m-0'><span  class='styleNormalBold'>` + level2.heading + `:&nbsp;&nbsp;</span>`;
                                if (level2.value != undefined && level2.value != "") {
                                    strHTMLPatientROS += "<span class='m-0 px-1 styleNormal'>" + level2.value + "</span>";
                                }
                                strHTMLPatientROS += `</p>`;

                                let lstLevel3: Array<any> = new ListFilterPipe().transform(this.acPatROSDynamicDisplayModel, 'parent_id', level2.id);

                                lstLevel3.forEach(level3 => {

                                    strHTMLPatientROS += `<p class='pl-3  m-0'><span class='styleNormalBold'>` + level3.heading + `:&nbsp;&nbsp;</span>`;
                                    if (level3.value != undefined && level3.value != "") {
                                        strHTMLPatientROS += "<span class='m-0 px-1 styleNormal'>" + level3.value + "</span>";
                                    }
                                    strHTMLPatientROS += `</p>`;
                                });
                            });
                        });

                        strHTMLPatientROS += "</td></tr></tbody></table>";
                        this.strHtmlString += strHTMLPatientROS;
                        this.strHtmlString += this.strModuleGap;
                    }
                }
            }
        }
        catch (e) {
            this.logMessage.log("ROS-HTML" + e);
        }

        // try {
        //     var strRosDetail: String = "";
        //     var arrMain: any;
        //     this.strHTMLPatientROS = "";
        //     //if (this.lookupList.UserRights.ViewROS) {
        //     if (this.acPatROS != null && this.acPatROS.length > 0 && this.acPatROS[0].ros_detail != null && this.acPatROS[0].ros_detail != "") {

        //         this.strHTMLPatientROS = "<table width='98%' class='tableMain'> <tbody>" +
        //             "<tr>" +
        //             "<th colspan='2'>Review Of Systems</th>" +
        //             "</tr>";
        //         // if(GeneralOptions.Practice_Template_Type=='A-CHART' ||  GeneralOptions.Practice_Template_Type=='CHART_TEMPLATE')
        //         // {
        //         //     this.strHTMLPatientROS+=	"<tr>" +
        //         //         " <td colspan='2' align='left' valign='center'>"+GeneralOptions.ReplaceAll(this.acPatROS[0].ros_detail.toString(),"\n","<br>")+"</td> "+									
        //         //         " </tr> ";								

        //         //     this.strHTMLPatientROS+="</tbody></table>";
        //         //     this.strHtmlString+=this.strHTMLPatientROS;
        //         //     this.strHtmlString+=this.strModuleGap;
        //         //     return;
        //         // }


        //         var strROSDescription: string = "";
        //         var strROSItemDescription: string = "";
        //         var strComplaints: string = "";
        //         var strDenies: string = "";
        //         var strComments: string = "";
        //         var addsubHeading: Boolean = false;

        //         //var i:int=0;
        //         var sno = 1;
        //         //----
        //         arrMain = this.acPatROS[0].ros_detail.toString().split("Ç");
        //         for (var i = 0; i < arrMain.length; i++) {
        //             var strsub: String = arrMain[i].toString();
        //             var sub: any = strsub.split("Æ");
        //             for (var j = 1; j < sub.length - 1; j++) {
        //                 strROSDescription = sub[0].toString();
        //                 //if(sub[0].toString().toUpperCase()==grdROS.selectedItem.description.toString().toUpperCase())
        //                 {
        //                     var strFinal: String = sub[j].toString();
        //                     var arrFinal: any = strFinal.split("¥");

        //                     //for(var l:int=0;l<arrFinal.length;l++)
        //                     {
        //                         //if(this.acPatROSItems[l].description.toString().toUpperCase()==arrFinal[0].toString().toUpperCase())
        //                         {
        //                             if (arrFinal[1] == "true")//deny
        //                             {
        //                                 if (strDenies != "") {
        //                                     strDenies += ", ";
        //                                 }
        //                                 strDenies += arrFinal[0].toString();
        //                                 if (arrFinal[3] != null && arrFinal[3] != "") {
        //                                     strDenies += " (" + arrFinal[3] + ")";
        //                                 }
        //                             }
        //                             else if (arrFinal[2] == "true") //compl
        //                             {
        //                                 if (strComplaints != "") {
        //                                     strComplaints += ", ";
        //                                 }
        //                                 strComplaints += arrFinal[0].toString();
        //                                 if (arrFinal[3] != null && arrFinal[3] != "") {
        //                                     strComplaints += " (" + arrFinal[3] + ")";
        //                                 }

        //                             }
        //                         }
        //                     }
        //                 }


        //             }

        //             addsubHeading = true;
        //             if (addsubHeading && (strComplaints != "" || strDenies != "")) {
        //                 if (strROSDescription != "") {

        //                     this.strHTMLPatientROS += "<tr >" +
        //                         "	<td colspan='2' class='styleModuleSubHeader'>" + sno + ".  " + this.generalOperation.ReplaceHTMLReservedWords(strROSDescription) + "</td>" +
        //                         "</tr>";

        //                     var rowadded: Boolean = false;
        //                     if (strComplaints != "") {
        //                         this.strHTMLPatientROS += "<tr>" +
        //                             "<td width='110' valign='top'><span class='styleNormalBold'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Patient has:</span></td>" +
        //                             "<td valign='top'>" + strComplaints + "</td>" +
        //                             "</tr>";
        //                     }

        //                     if (strDenies != "") {
        //                         this.strHTMLPatientROS += "<tr>" +
        //                             "<td width='110' valign='top'><span class='styleNormalBold'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Patient Denies:</span></td>" +
        //                             "<td valign='top'><span class='styleNormal'>" + strDenies + "</span></td>" +
        //                             "</tr>";

        //                     }
        //                     sno = sno + 1;
        //                 }
        //                 strROSItemDescription = "";
        //                 strComplaints = "";
        //                 strDenies = "";
        //             }
        //         }

        //         this.strHTMLPatientROS += "</tbody></table>";//<hr align='left' width='750'>";
        //         this.strHtmlString += this.strHTMLPatientROS;
        //         //strHtmlString+="<br>";
        //         this.strHtmlString += this.strModuleGap;

        //     }
        //     // }
        // }
        // catch (e) {
        //     this.logMessage.log("ROS-HTML" + e);
        // }
    }
    PlanOfCareNotes() {
        try {
            //if (this.lookupList.UserRights.ViewProgressNote) {
            if (this.acPlanOfCareNotes != null && this.acPlanOfCareNotes.length > 0) {
                this.strHTMLPlanOfCareNotes = "<table width='98%' class='tableMain'> <tbody>" +
                    "<tr>" +
                    "<th colspan='2'>Plan Of Care</th>" +
                    "</tr>";

                var count = 1;
                for (var i = 0; i < this.acPlanOfCareNotes.length; i++) {
                    if (this.acPlanOfCareNotes[i].notes_text != null && this.acPlanOfCareNotes[i].notes_text != "") {
                        if (count > 0 && count % 2 == 0)
                            this.strHTMLPlanOfCareNotes += "<tr class='styleAlternateRowColor'>";
                        else
                            this.strHTMLPlanOfCareNotes += "<tr>";

                        if (this.acPlanOfCareNotes.length > 1) {
                            this.strHTMLPlanOfCareNotes += "<td valign='top' width='10'><span class='styleNormal'>" + count + "</span></td>";
                            this.strHTMLPlanOfCareNotes += "<td valign='top'>" + this.generalOperation.richTextEditorToHtml(this.acPlanOfCareNotes[i].notes_html) + "</td>";
                        }
                        else {
                            this.strHTMLPlanOfCareNotes += "<td colspan='2' valign='top'>" + this.generalOperation.richTextEditorToHtml(this.acPlanOfCareNotes[i].notes_html) + "</td>";
                        }
                        this.strHTMLPlanOfCareNotes += "</tr>";

                        count++;
                    }
                }
                this.strHTMLPlanOfCareNotes += "</tbody> </table>";
                this.strHtmlString += this.strHTMLPlanOfCareNotes;
                this.strHtmlString += this.strModuleGap;
            }
            // }
        }
        catch (e) {
            this.logMessage.log("PlanofCareNotes-HTML" + e);
        }
    }
    Annotation() {
        try {
            this.strHTMLPatientAnnotation = "";

            {
                if (this.acPatAnnotation != null && this.acPatAnnotation.length > 0) {
                    this.strHTMLPatientAnnotation = " <table width='98%' class='tableMain'> <tbody>" +
                        "<tr>" +
                        "<th colspan='2'>Annotation</th>" +
                        "</tr>";
                    var i = 0;
                    var sno = 1;

                    for (; i < this.acPatAnnotation.length; i++) {
                        if (this.acPatAnnotation[i].comments != null && this.acPatAnnotation[i].comments != "") {
                            if (sno > 0 && i % sno == 0)
                                this.strHTMLPatientAnnotation += "<tr class='styleAlternateRowColor'>";
                            else
                                this.strHTMLPatientAnnotation += "<tr>";

                            this.strHTMLPatientAnnotation += "<td width='10' valign='top'>" + sno + "</td><td valign='top' ><span class='styleNormalBold'>Comments By " + this.acPatAnnotation[i].provided_by + ":&nbsp;</span>" + this.generalOperation.ReplaceHTMLReservedWords(this.acPatAnnotation[i].comments) + "</td>";
                            this.strHTMLPatientAnnotation += "</tr>";
                            sno++;
                        }
                    }
                    this.strHTMLPatientAnnotation += " </tbody></table>";
                    this.strHtmlString += this.strHTMLPatientAnnotation;
                    this.strHtmlString += this.strModuleGap;
                }
            }
        }
        catch (e) {
            this.logMessage.log("Annotation-HTML" + e);
        }
    }
    Cognitive() {
        try {
            this.strHTMLPatientCognitive = "";
            if (this.acCognitiveStatus != null && this.acCognitiveStatus.length > 0) {
                var i = 0;
                var count = 1;
                this.strHTMLPatientCognitive = "<table width='98%' class='tableMain'> <tbody>" +
                    "<tr>" +
                    "<th colspan='5'>Cognitive/Functional History</th>" +
                    "</tr>" +
                    "<tr class='styleModuleSubHeader'>" +
                    "	<td width='10'></td>" +
                    "	<td width ='65'>Date</td>" +
                    "	<td width ='80' >Type</td>" +
                    "	<td>Description</td>" +
                    "	<td>Notes</td>" +
                    "</tr>";

                for (i = 0; i < this.acCognitiveStatus.length; i++) {
                    var date: String = (this.acCognitiveStatus[i].effective_date != null && this.acCognitiveStatus[i].effective_date != "01/01/1900") ? this.acCognitiveStatus[i].effective_date : "";
                    var type: String = (this.acCognitiveStatus[i].type != null) ? this.acCognitiveStatus[i].type : "";
                    var desc: String = (this.acCognitiveStatus[i].snomed_description != null) ? this.acCognitiveStatus[i].snomed_description : "";
                    var notes: String = (this.acCognitiveStatus[i].notes != null) ? this.acCognitiveStatus[i].notes : "";


                    if (count > 0 && count % 2 == 0)
                        this.strHTMLPatientCognitive += "<tr class='styleAlternateRowColor'>";
                    else
                        this.strHTMLPatientCognitive += "<tr>";

                    this.strHTMLPatientCognitive += "<td valign='top'>" + count + "</td> ";
                    this.strHTMLPatientCognitive += " <td valign='top'>" + date + "</td> ";
                    this.strHTMLPatientCognitive += " <td valign='top'>" + type.trim() + "</td> ";
                    this.strHTMLPatientCognitive += " <td valign='top'>" + this.generalOperation.ReplaceHTMLReservedWords(desc.trim()) + "</td> ";
                    this.strHTMLPatientCognitive += " <td valign='top'>" + this.generalOperation.ReplaceAll(this.generalOperation.ReplaceHTMLReservedWords(notes.trim()), "\n", "<br>") + "</td> ";
                    this.strHTMLPatientCognitive += " </tr> ";
                    count++;
                }
                this.strHTMLPatientCognitive += " </tbody></table>";
                this.strHtmlString += this.strHTMLPatientCognitive;
                this.strHtmlString += this.strModuleGap;

            }
        }
        catch (e) {
            this.logMessage.log("Cognative-HTML" + e);
        }
    }
    CarePlan() {
        try {
            this.strHTMLPatientCarePlan = "";
            {
                if (this.acCarePlan != null && this.acCarePlan.length > 0) {

                    this.strHTMLPatientCarePlan = " <table width='98%' class='tableMain'> <tbody>" +
                        "<tr>" +
                        "<th colspan='4'>Care Plan</th>" +
                        "</tr>" +
                        "<tr class='styleModuleSubHeader'>" +
                        "<td width='10'></td>" +
                        "<td width ='65'>Date</td>" +
                        "<td width ='100' >Type</td>" +
                        "<td>Notes</td>" +
                        "</tr>";

                    var i = 0;
                    var count = 1;

                    for (i = 0; i < this.acCarePlan.length; i++) {

                        var date: string = (this.acCarePlan[i].date != null && this.acCarePlan[i].date != "01/01/1900") ? this.acCarePlan[i].date : "";
                        var type: string = (this.acCarePlan[i].plan_type != null) ? this.acCarePlan[i].plan_type : "";
                        var notes: string = (this.acCarePlan[i].instruction != null) ? this.acCarePlan[i].instruction : "";


                        if (i % 2 == 1)
                            this.strHTMLPatientCarePlan += "<tr style='background-color: #f3f6fb;'>";
                        else
                            this.strHTMLPatientCarePlan += "<tr>";

                        this.strHTMLPatientCarePlan += "<td valign='top'>" + count + "</td> " +
                            " <td valign='top'>" + date + "</td> " +
                            " <td valign='top'>" + type.trim() + "</td> " +
                            " <td valign='top'>" + this.generalOperation.ReplaceAll(this.generalOperation.ReplaceHTMLReservedWords(notes), "\n", "<br>").trim() + "</td> " +
                            " </tr> ";
                        count++;
                    }

                    this.strHTMLPatientCarePlan += " </tbody></table>";
                    this.strHtmlString += this.strHTMLPatientCarePlan;
                    this.strHtmlString += this.strModuleGap;
                }
            }
        }
        catch (e) {
            this.logMessage.log("Care Plan-HTML" + e);
        }
    }
    PhysicalExam() {

        try {
            debugger
            let strHTMLPhysicalExam: string = "";

            if (this.objPE != undefined) {

                if (this.objPE.entry_type.toLowerCase() == 'free_text') {


                    if (this.objPE.pe_detail != undefined && this.objPE.pe_detail != null && this.objPE.pe_detail != '') {
                        strHTMLPhysicalExam = "<table width='98%' class='tableMain'> <tbody>" +
                            "<tr>" +
                            "<th>Physical Exam</th>" +
                            "</tr>" +
                            "<tr>" +
                            "<td>";
                        strHTMLPhysicalExam += "<span class='m-0 styleNormal'>" + this.generalOperation.ReplaceAll(this.generalOperation.ReplaceHTMLReservedWords(this.objPE.pe_detail), "\n", "<br>")
                            + "</span>";
                        strHTMLPhysicalExam += "</td></tr></tbody></table>";
                        this.strHtmlString += strHTMLPhysicalExam;
                        this.strHtmlString += this.strModuleGap;
                    }
                    // strHTMLPhysicalExam = `<span class='styleModuleHeader'>Physical Exam</span>`;
                    // strHTMLPhysicalExam += `<div class='pl-1'>`;
                    // strHTMLPhysicalExam += `<p class='pl-1 m-0'>`;
                    // strHTMLPhysicalExam += "<span class='m-0 px-1 styleNormal'>" + this.generalOperation.ReplaceAll(this.generalOperation.ReplaceHTMLReservedWords(this.objPE.pe_detail), "\n", "<br>") + "</span>";
                    // strHTMLPhysicalExam += `</p>`;
                    // strHTMLPhysicalExam += `</div>`;



                }
                else if (this.objPE.entry_type.toLowerCase() == 'dynamic_template') {

                    if (this.acPatPEDynamicDisplayModel != null && this.acPatPEDynamicDisplayModel.length > 0) {

                        let lstLevel1: Array<any> = new ListFilterPipe().transform(this.acPatPEDynamicDisplayModel, 'level', 1);

                        strHTMLPhysicalExam = "<table width='98%' class='tableMain'><tbody>" +
                            "<tr>" +
                            "<th>Physical Exam</th>" +
                            "</tr>" +
                            "<tr>" +
                            "<td>";

                        strHTMLPhysicalExam += `<div class='pl-1'>`;
                        // debugger;
                        lstLevel1.forEach(level1 => {
                            strHTMLPhysicalExam += `<p class='pl-1  m-0'>`;
                            if (level1.heading != undefined && level1.heading != "") {
                                strHTMLPhysicalExam += `<span class='styleNormalBold'>` + level1.heading + `:&nbsp;&nbsp;</span>`;
                            }
                            if (level1.value != undefined && level1.value != "") {
                                strHTMLPhysicalExam += "<span class='m-0 px-1 styleNormal'>" + level1.value + "</span>";
                            }
                            strHTMLPhysicalExam += `</p>`;

                            let lstLevel2: Array<any> = new ListFilterPipe().transform(this.acPatPEDynamicDisplayModel, 'parent_id', level1.id);
                            //debugger;
                            lstLevel2.forEach(level2 => {

                                strHTMLPhysicalExam += `<p class='pl-2  m-0'>`;
                                if (level2.heading != undefined && level2.heading != "") {
                                    strHTMLPhysicalExam += `<span class='styleNormalBold'>` + level2.heading + `:&nbsp;&nbsp;</span>`;
                                }
                                if (level2.value != undefined && level2.value != "") {
                                    strHTMLPhysicalExam += "<span class='m-0 px-1 styleNormal'>" + level2.value + "</span>";
                                }
                                strHTMLPhysicalExam += `</p>`;

                                let lstLevel3: Array<any> = new ListFilterPipe().transform(this.acPatPEDynamicDisplayModel, 'parent_id', level2.id);

                                //  debugger;
                                lstLevel3.forEach(level3 => {

                                    strHTMLPhysicalExam += `<p class='pl-3  m-0'>`;
                                    if (level3.heading != undefined && level3.heading != "") {
                                        strHTMLPhysicalExam += `<span class='styleNormalBold'>` + level3.heading + `:&nbsp;&nbsp;</span>`;
                                    }
                                    if (level3.value != undefined && level3.value != "") {
                                        strHTMLPhysicalExam += "<span class='m-0 px-1 styleNormal'>" + level3.value + "</span>";
                                    }
                                    strHTMLPhysicalExam += `</p>`;
                                });
                            });
                        });

                        strHTMLPhysicalExam += `</div>`;
                        strHTMLPhysicalExam += "</td></tr></tbody></table>";
                        this.strHtmlString += strHTMLPhysicalExam;
                        this.strHtmlString += this.strModuleGap;
                    }
                }


                debugger;
                // if (this.acPatPhysicalExamImages != null && this.acPatPhysicalExamImages.length > 0) {

                //     strHTMLPhysicalExam += `<table width='` + this.module_table_width + `' class='tableNoBorder'>
                //             <tbody>`;
                //     let iterator = 0;
                //     strHTMLPhysicalExam += `<tr>`;
                //     this.acPatPhysicalExamImages.forEach(att => {

                //         if (iterator > 0 && iterator % 3 == 0) {
                //             strHTMLPhysicalExam += `</tr><tr>`;
                //         }
                //         strHTMLPhysicalExam += `<td class='w-33'>
                //                         <span>Attachment # ` + (iterator + 1) + ` </span><br>                            
                //                         <img class='img-thumbnail max-height-250' src='` + att.full_url + `'></img>
                //                         </td>
                //                     `;

                //         iterator++;

                //     });

                //     if (iterator > 0 && iterator % 3 != 0) {
                //         while (iterator % 3 != 0) {
                //             strHTMLPhysicalExam += "<td class='w-33'></td>";
                //             iterator++;
                //         }
                //     }
                //     strHTMLPhysicalExam += "</tr>";
                //     strHTMLPhysicalExam += ` </tbody></table>`;

                // }

                this.strHtmlString += strHTMLPhysicalExam;
                this.strHtmlString += this.strModuleGap;
            }
        }
        catch (e) {
            this.logMessage.log("PhysicalExam-HTML" + e);
        }


        // try {
        //     this.strHTMLPhysicalExam = "";
        //     //if (this.lookupList.UserRights.ViewPE) {
        //     if (this.acPatPhysicalExam != null && this.acPatPhysicalExam.length > 0) {
        //         this.strHTMLPhysicalExam = "<table width='98%' class='tableMain'> <tbody>" +
        //             "<tr>" +
        //             "<th colspan='2'>Physical Exam</th>" +
        //             "</tr>";
        //         // if(GeneralOptions.Practice_Template_Type=='A-CHART' ||  GeneralOptions.Practice_Template_Type=='CHART_TEMPLATE')
        //         // {
        //         //     this.strHTMLPhysicalExam+=	"<tr>" +
        //         //         " <td colspan='2' align='left' valign='center'>"+this.generalOperation.ReplaceAll(this.acPatPhysicalExam[0].pe_detail.toString(),"\n","<br>")+"</td> "+									
        //         //         " </tr> ";								

        //         //         this.strHTMLPhysicalExam+="</tbody></table>";
        //         //         this.strHtmlString+=this.strHTMLPhysicalExam;
        //         //     //strHtmlString+="<br></br>";
        //         //     this.strHtmlString+=this.strModuleGap;
        //         //     return;
        //         // }
        //         var sno = 1;
        //         var organ_name: string = "";
        //         var organ_detail: string = "";
        //         var organ_detail_value: string = "";
        //         var Comments: string = "";
        //         var count = 0;
        //         var no = 0;
        //         var mainHeading: Boolean = false;
        //         let arrMain: any
        //         arrMain = this.acPatPhysicalExam[0].pe_detail.toString().split("Ç");
        //         for (var i = 0; i < arrMain.length; i++) {
        //             mainHeading = false;
        //             var strsub: String = arrMain[i].toString();
        //             var sub: any = strsub.split("Æ");
        //             for (var j = 1; j < sub.length - 1; j++) {
        //                 var strFinal: String = sub[j].toString();
        //                 var arrFinal: any = strFinal.split("¥");
        //                 organ_detail = arrFinal[0];
        //                 Comments = "";
        //                 organ_detail_value = "";
        //                 if (arrFinal[2] != null && arrFinal[2] != "" && arrFinal[2] == "true") {
        //                     organ_detail_value = "Normal";
        //                 }
        //                 if (arrFinal.length > 2 && arrFinal[3] != null && arrFinal[3] != "" && arrFinal[3] == "true") {
        //                     organ_detail_value = "Abnormal";
        //                 }
        //                 if (arrFinal.length > 1 && arrFinal[1] != null && arrFinal[1] != "") {
        //                     Comments = arrFinal[1];
        //                 }

        //                 if (organ_detail_value != null && organ_detail_value != "") {
        //                     no++;
        //                     var rowadded: Boolean = false;
        //                     if (mainHeading == false) {
        //                         organ_name = sub[0].toString().toUpperCase();

        //                         this.strHTMLPhysicalExam += "<tr >" +
        //                             "	<td colspan='2' class='styleModuleSubHeader'>" + sno + ".  " + organ_name + "</td>" +
        //                             "</tr>";

        //                         mainHeading = true;
        //                         count = 0;
        //                         sno++;
        //                     }

        //                     if (no > 0 && no % 2 == 0)
        //                         this.strHTMLPhysicalExam += "<tr class='styleAlternateRowColor'>";
        //                     else
        //                         this.strHTMLPhysicalExam += "<tr>";

        //                     if (Comments != "") {
        //                         this.strHTMLPhysicalExam += "<td valign='top' width='150' ><span class='styleNormalBold'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + organ_detail + ": </span></td>" +
        //                             "<td valign='top'>" + organ_detail_value + " (" + this.generalOperation.ReplaceHTMLReservedWords(Comments) + ")</td>";

        //                     }
        //                     else {
        //                         this.strHTMLPhysicalExam += "<td valign='top' width='150'><span class='styleNormalBold'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + organ_detail + ": </span></td>" +
        //                             "<td valign='top'>" + organ_detail_value + "</td>";
        //                     }

        //                     this.strHTMLPhysicalExam += "</tr>";
        //                     count++;
        //                 }
        //             }
        //         }
        //         this.strHTMLPhysicalExam += "</tbody></table>";
        //         this.strHtmlString += this.strHTMLPhysicalExam;
        //         //strHtmlString+="<br>";
        //         this.strHtmlString += this.strModuleGap;

        //     }
        //     //}
        // }
        // catch (e) {
        //     this.logMessage.log("PhysicalExam-HTML" + e);
        // }
    }
    TreatmentNotes() {
        try {
            if (this.acTreatmentNotes != null && this.acTreatmentNotes.length > 0) {
                this.strHTMLPatientTreatmentNotes = " <table width='98%' class='tableMain'><tbody>" +
                    " <tr><th colspan='4' >Personal Injury Treatment Note</th></tr>  ";


                var pain_level: String = "";
                var clinical_aide: String = "";
                var treatment_location: String = "";
                var treatmentHTML: String = "";

                var strDetailsHTML: String = "";


                for (var i = 0; i < this.acTreatmentNotes.length; i++) {
                    pain_level = this.acTreatmentNotes[i].pain_level == null ? "" : (this.acTreatmentNotes[i].pain_level + "/10");
                    clinical_aide = this.acTreatmentNotes[i].clinical_aide == null ? "" : this.acTreatmentNotes[i].clinical_aide;
                    treatment_location = this.acTreatmentNotes[i].location == null ? "" : this.acTreatmentNotes[i].location;
                    /*if(i==0)
                    {
                    this.strHTMLPatientTreatmentNotes+="<table width='98%' class='tableMain'>  "+									
                    "<tbody>"+
                    "<tr><th colspan='4'>PERSONAL INJURY TREATMENT NOTE</th></tr> "+
                    "</tbody></table>";
                    }*/
                    this.strHTMLPatientTreatmentNotes += "<tr>" +
                        "	<td class='styleModuleSubHeader'>" + this.acTreatmentNotes[i].dov + "</td>" +
                        "	<td class='styleModuleSubHeader'>DOA:&nbsp;" + this.acTreatmentNotes[i].date + "</td>" +
                        "	<td class='styleModuleSubHeader'>Pain Level:&nbsp;" + pain_level + "</td>" +
                        "	<td class='styleModuleSubHeader'>Clinical Aide:&nbsp;" + clinical_aide + "</td>" +
                        "</tr>";

                    strDetailsHTML = "";
                    if (treatment_location != "") {

                        strDetailsHTML += "<tr>" +
                            "  <td width='5'></td>" +
                            "  <td colspan='7'><span class='styleNormalBold'><u>Treatment Location: </u></span></td>" +
                            "  </tr>" +
                            "  <tr>" +
                            "	<td width='5'></td>" +
                            "	<td width='10'></td>" +
                            "	<td colspan='6'><span class='styleNormal'>" + treatment_location + "</span> </td>" +
                            "  </tr>";

                    }

                    treatmentHTML = "";
                    var count = 1;
                    var no = 0;
                    if (this.acTreatmentNotes[i].hot_pack.toString().split("~")[0] == "true") {
                        if (no == 0)
                            treatmentHTML += "<tr>" +
                                "	<td width='5'></td>" +
                                "	<td width='10'></td>";

                        if (no > 0 && no % 3 == 0) {
                            treatmentHTML += "</tr><tr>" +
                                "	<td width='10'></td>" +
                                "	<td width='10'></td>";
                        }


                        treatmentHTML += "<td width='15'>" + count + ".</td>" +
                            "<td ><span class='styleNormalBold'>Hot packs: </span>";

                        if (this.acTreatmentNotes[i].hot_pack.toString().split("~").length > 0) {
                            if (this.acTreatmentNotes[i].hot_pack.toString().split("~")[1] != null && this.acTreatmentNotes[i].hot_pack.toString().split("~")[1] != "") {
                                treatmentHTML += "<span class='styleNormal'>" + this.acTreatmentNotes[i].hot_pack.toString().split("~")[1] + "</span>";
                            }
                        }
                        treatmentHTML += "</td>";
                        count++;
                        no++;
                    }
                    if (this.acTreatmentNotes[i].cold_pack.toString().split("~")[0] == "true") {
                        if (no == 0)
                            treatmentHTML += "<tr>" +
                                "	<td width='5'></td>" +
                                "	<td width='10'></td>";

                        if (no > 0 && no % 3 == 0) {
                            treatmentHTML += "</tr><tr>" +
                                "	<td width='5'></td>" +
                                "	<td width='10'></td>";
                        }

                        treatmentHTML += "<td width='15'>" + count + ".</td>" +
                            "<td ><span class='styleNormalBold'>Cold packs: </span>";

                        if (this.acTreatmentNotes[i].cold_pack.toString().split("~").length > 0) {
                            if (this.acTreatmentNotes[i].cold_pack.toString().split("~")[1] != null && this.acTreatmentNotes[i].cold_pack.toString().split("~")[1] != "") {
                                treatmentHTML += "<span class='styleNormal'>" + this.acTreatmentNotes[i].cold_pack.toString().split("~")[1] + "</span>";
                            }
                        }
                        treatmentHTML += "</td>";
                        count++;
                        no++;
                    }
                    if (this.acTreatmentNotes[i].electrical_stimulation.toString().split("~")[0] == "true") {
                        if (no == 0)
                            treatmentHTML += "<tr>" +
                                "	<td width='5'></td>" +
                                "	<td width='10'></td>";

                        if (no > 0 && no % 3 == 0) {
                            treatmentHTML += "</tr><tr>" +
                                "	<td width='5'></td>" +
                                "	<td width='10'></td>";
                        }

                        treatmentHTML += "<td width='15'>" + count + ".</td>" +
                            "<td ><span class='styleNormalBold'>Electrical stimulation: </span>";

                        if (this.acTreatmentNotes[i].electrical_stimulation.toString().split("~").length > 0) {
                            if (this.acTreatmentNotes[i].electrical_stimulation.toString().split("~")[1] != null && this.acTreatmentNotes[i].electrical_stimulation.toString().split("~")[1] != "") {
                                treatmentHTML += "<span class='styleNormal'>" + this.acTreatmentNotes[i].electrical_stimulation.toString().split("~")[1] + "</span>";
                            }
                        }
                        treatmentHTML += "</td>";
                        count++;
                        no++;
                    }
                    if (this.acTreatmentNotes[i].ultrasound.toString().split("~")[0] == "true") {
                        if (no == 0)
                            treatmentHTML += "<tr>" +
                                "	<td width='5'></td>" +
                                "	<td width='10'></td>";

                        if (no > 0 && no % 3 == 0) {
                            treatmentHTML += "</tr><tr>" +
                                "	<td width='10'></td>" +
                                "	<td width='10'></td>";
                        }

                        treatmentHTML += "<td width='15'>" + count + ".</td>" +
                            "<td ><span class='styleNormalBold'>Ultrasound: </span>";

                        if (this.acTreatmentNotes[i].ultrasound.toString().split("~").length > 0) {
                            if (this.acTreatmentNotes[i].ultrasound.toString().split("~")[1] != null && this.acTreatmentNotes[i].ultrasound.toString().split("~")[1] != "") {
                                treatmentHTML += "<span class='styleNormal'>" + this.acTreatmentNotes[i].ultrasound.toString().split("~")[1] + "</span>";
                            }
                        }
                        treatmentHTML += "</td>";
                        count++;
                        no++;
                    }
                    if (this.acTreatmentNotes[i].percussion_massage.toString().split("~")[0] == "true") {
                        if (no == 0)
                            treatmentHTML += "<tr>" +
                                "	<td width='5'></td>" +
                                "	<td width='10'></td>";

                        if (no > 0 && no % 3 == 0) {
                            treatmentHTML += "</tr><tr>" +
                                "	<td width='5'></td>" +
                                "	<td width='10'></td>";
                        }

                        treatmentHTML += "<td width='15'>" + count + ".</td>" +
                            "<td ><span class='styleNormalBold'>Percussion massage: </span>";

                        if (this.acTreatmentNotes[i].percussion_massage.toString().split("~").length > 0) {
                            if (this.acTreatmentNotes[i].percussion_massage.toString().split("~")[1] != null && this.acTreatmentNotes[i].percussion_massage.toString().split("~")[1] != "") {
                                treatmentHTML += "<span class='styleNormal'>" + this.acTreatmentNotes[i].percussion_massage.toString().split("~")[1] + "</span>";
                            }
                        }
                        treatmentHTML += "</td>";
                        count++;
                        no++;
                    }
                    if (this.acTreatmentNotes[i].vibration_massage.toString().split("~")[0] == "true") {
                        if (no == 0)
                            treatmentHTML += "<tr>" +
                                "	<td width='5'></td>" +
                                "	<td width='10'></td>";

                        if (no > 0 && no % 3 == 0) {
                            treatmentHTML += "</tr><tr>" +
                                "	<td width='5'></td>" +
                                "	<td width='10'></td>";
                        }

                        treatmentHTML += "<td width='15'>" + count + ".</td>" +
                            "<td><span class='styleNormalBold'>Vibration massage: </span>";

                        if (this.acTreatmentNotes[i].vibration_massage.toString().split("~").length > 0) {
                            if (this.acTreatmentNotes[i].vibration_massage.toString().split("~")[1] != null && this.acTreatmentNotes[i].vibration_massage.toString().split("~")[1] != "") {
                                treatmentHTML += "<span class='styleNormal'>" + this.acTreatmentNotes[i].vibration_massage.toString().split("~")[1] + "</span>";
                            }
                        }
                        treatmentHTML += "</td>";
                        count++;
                        no++;
                    }
                    if (this.acTreatmentNotes[i].paraffin_wax.toString().split("~")[0] == "true") {
                        if (no == 0)
                            treatmentHTML += "<tr>" +
                                "	<td width='5'></td>" +
                                "	<td width='10'></td>";

                        if (no > 0 && no % 3 == 0) {
                            treatmentHTML += "</tr><tr>" +
                                "	<td width='5'></td>" +
                                "	<td width='10'></td>";
                        }

                        treatmentHTML += "<td width='15'>" + count + ".</td>" +
                            "<td ><span class='styleNormalBold'>Paraffin wax: </span>";

                        if (this.acTreatmentNotes[i].paraffin_wax.toString().split("~").length > 0) {
                            if (this.acTreatmentNotes[i].paraffin_wax.toString().split("~")[1] != null && this.acTreatmentNotes[i].paraffin_wax.toString().split("~")[1] != "") {
                                treatmentHTML += "<span class='styleNormal'>" + this.acTreatmentNotes[i].paraffin_wax.toString().split("~")[1] + "</span>";
                            }
                        }
                        treatmentHTML += "</td>";
                        count++;
                        no++;
                    }
                    if (this.acTreatmentNotes[i].biofreeze_gel.toString().split("~")[0] == "true") {
                        if (no == 0)
                            treatmentHTML += "<tr>" +
                                "	<td width='5'></td>" +
                                "	<td width='10'></td>";

                        if (no > 0 && no % 3 == 0) {
                            treatmentHTML += "</tr><tr>" +
                                "	<td width='5'></td>" +
                                "	<td width='10'></td>";
                        }

                        treatmentHTML += "<td width='15'>" + count + ".</td>" +
                            "<td ><span class='styleNormalBold'>Biofreeze gel: </span>";

                        if (this.acTreatmentNotes[i].biofreeze_gel.toString().split("~").length > 0) {
                            if (this.acTreatmentNotes[i].biofreeze_gel.toString().split("~")[1] != null && this.acTreatmentNotes[i].biofreeze_gel.toString().split("~")[1] != "") {
                                treatmentHTML += "<span class='styleNormal'>" + this.acTreatmentNotes[i].biofreeze_gel.toString().split("~")[1] + "</span>";
                            }
                        }
                        treatmentHTML += "</td>";
                        count++;
                        no++;
                    }

                    if (no > 0 && no % 3 != 0) {
                        while (no % 3 != 0) {
                            treatmentHTML += "<td valign='top'></td>";
                            no++;
                        }
                    }

                    if (treatmentHTML != "") {
                        treatmentHTML += "</tr>";
                        strDetailsHTML += "<tr><td width='5'></td><td colspan='7' align='left' valign='center' ><span class='styleNormalBold'><u>Treatment: </u></span></td></tr>" + treatmentHTML;
                    }

                    if (this.acTreatmentNotes[i].comments != null && this.acTreatmentNotes[i].comments != "") {
                        strDetailsHTML += "<tr><td width='5'></td><td colspan='7' align='left' valign='center' ><span class='styleNormalBold'><u>Notes: </u></span></td></tr>" +
                            "<tr><td width='5'></td><td width='10'></td><td colspan='6'><span class='styleNormal'>" + this.acTreatmentNotes[i].comments + "</span></td></tr>";
                    }

                    if (strDetailsHTML != "") {
                        this.strHTMLPatientTreatmentNotes += "<tr > " +
                            "	<td colspan='4' valign='top'>" +
                            "		<table width='100%' class='tableNoBorder'>" +
                            strDetailsHTML +
                            "		</table>" +
                            "   </td>" +
                            "</tr>";

                    }
                    //this.strHTMLPatientTreatmentNotes+="</table></td></tr>";

                }
                this.strHTMLPatientTreatmentNotes += "</tbody></table>";
                this.strHtmlString += this.strHTMLPatientTreatmentNotes;
                this.strHtmlString += this.strModuleGap;
            }
        }
        catch (e) {
            this.logMessage.log("Treatment Notes-HTML" + e);
        }
    }
    AWV_Print() {
        try {
            if (this.acawvprint != null && this.acawvprint.length > 0) {
                this.strHTMLPatientAWV = "<table width='98%' class='tableMain'>" +
                    "<tbody>" +
                    "	<tr >" +
                    "		<th colspan='5'> Annual Wellness Questionnaire </th>" +
                    "	</tr>";

                var acdistinctques: any = (new UniquePipe).transform(this.acawvprint, "ques_id");
                for (var a = 0; a < acdistinctques.length; a++) {
                    var main: Boolean = false;
                    var col: String = "";
                    var score = 0;
                    var count = 0;

                    for (var i = 0; i < this.acawvprint.length; i++) {
                        if (this.acawvprint[i].ques_id == acdistinctques[a]) {
                            if (main == false) {
                                count = 1;
                                this.strHTMLPatientAWV += "<tr class='styleModuleSubHeader'> " +
                                    "	<td colspan='5'>" + this.acawvprint[i].ques_main + "</td>" +
                                    "</tr>" +
                                    " <tr class='styleModuleSubHeader'>" +
                                    "	<td width='10' valign='center'></td>" +
                                    "	<td valign='center'>Question</td>" +
                                    "	<td width='40'  valign='center'>Option</td>" +
                                    "	<td width='40'  valign='center'>Score</td>" +
                                    "	<td width='200' valign='center'>Comments</td>" +
                                    "</tr>";
                                main = true;
                            }
                            var strOption: String = "";

                            if (this.acawvprint[i].yes == true)
                                strOption = "Yes"
                            else if (this.acawvprint[i].no == true)
                                strOption = "No"

                            if (count > 0 && count % 2 == 0)
                                this.strHTMLPatientAWV += "<tr class='styleAlternateRowColor'>";
                            else
                                this.strHTMLPatientAWV += "<tr>";

                            this.strHTMLPatientAWV += "	<td valign='top'>" + count + "</td>" +
                                "	<td valign='top'>" + this.acawvprint[i].ques_detail + "</td>" +
                                " 	<td valign='top'> " + strOption + "</td>  " +
                                "	<td valign='top'>" + this.acawvprint[i].score + "</td>" +
                                "	<td valign='top'>" + this.generalOperation.ReplaceHTMLReservedWords(this.acawvprint[i].comments) + "</td> " +
                                "</tr>";

                            if (!isNaN(Number(this.acawvprint[i].score))) {
                                score = score + Number(this.acawvprint[i].score)
                            }
                            count++;

                        }
                    }

                    this.strHTMLPatientAWV += "<tr class='styleNormalBold'>" +
                        "	<td colspan='4' valign='top' align='right' >Total score</td>" +
                        "	<td valign='top' class='styleModuleSubHeader'>" + score + "</td>" +
                        "</tr>";


                }
                this.strHTMLPatientAWV += " </tbody></table>";
                this.strHtmlString += this.strHTMLPatientAWV;
                this.strHtmlString += this.strModuleGap;
            }
        }
        catch (e) {
            this.logMessage.log("AWVPrint-HTML" + e);
        }
    }
    HealthMaint_Print() {
        try {
            if (this.acHealthMaint != null && this.acHealthMaint.length > 0) {
                this.strHTMLPatientHealthMent = "<table width='98%' class='tableMain'> <tbody>" +
                    "<tr>" +
                    "<th colspan='4'>Health Maintenance</th>" +
                    "</tr>";

                this.strHTMLPatientHealthMent += "<tr class='styleModuleSubHeader'>" +
                    " <td width='100'>Test Name</td> " +
                    " <td width='60' >Due Date</td> " +
                    " <td width='80' >Cmplete Date</td> " +
                    " <td>Comments</td> " +
                    "</tr>";

                var strCommonTestHTML: String = "";
                var strCustomTestHTML: String = "";
                var strOtherTestHTML: String = "";
                var strVaccinationHTML: String = "";
                var strLipidsHTML: String = "";

                var phm_id: String = "";

                var commonTestCount = 0;
                var customTestCount = 0;
                var otherTestCount = 0;
                var vaccineTestCount = 0;
                var lipidsTestCount = 0;

                for (var i = 0; i < this.acHealthMaint.length; i++) {
                    if (phm_id != this.acHealthMaint[i].phm_id) {
                        phm_id = this.acHealthMaint[i].phm_id;
                        this.strHTMLPatientHealthMent += "<tr class='styleModuleSubHeader'>" +
                            "<td valign='top' colspan='4'>Date: " + this.acHealthMaint[i].visit_date + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Provider: " + this.acHealthMaint[i].provider_id + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Location: " + this.acHealthMaint[i].location_id + "</td>" +
                            "</tr>";



                        if (strCommonTestHTML != "") {
                            this.strHTMLPatientHealthMent += "<tr><td colspan='4'><span class='styleNormalBold'><u>Common Tests:</u></span></td></tr>";
                            this.strHTMLPatientHealthMent += strCommonTestHTML;
                        }
                        if (strCustomTestHTML != "") {
                            this.strHTMLPatientHealthMent += "<tr><td colspan='4'><span class='styleNormalBold'><u>Custom Tests:</u></span></td></tr>";
                            this.strHTMLPatientHealthMent += strCustomTestHTML;
                        }
                        if (strOtherTestHTML != "") {
                            this.strHTMLPatientHealthMent += "<tr><td colspan='4'><span class='styleNormalBold'><u>Other Tests:</u></span></td></tr>";
                            this.strHTMLPatientHealthMent += strOtherTestHTML;
                        }
                        if (strVaccinationHTML != "") {
                            this.strHTMLPatientHealthMent += "<tr><td colspan='4'><span class='styleNormalBold'><u>Vaccination:</u></span></td></tr>";
                            this.strHTMLPatientHealthMent += strVaccinationHTML;
                        }
                        if (strLipidsHTML != "") {
                            this.strHTMLPatientHealthMent += "<tr><td colspan='4'><span class='styleNormalBold'><u>Lipids:</u></span></td></tr>";
                            this.strHTMLPatientHealthMent += strLipidsHTML;
                        }

                        strCommonTestHTML = "";
                        strCustomTestHTML = "";
                        strOtherTestHTML = "";
                        strVaccinationHTML = "";
                        strLipidsHTML = "";
                    }

                    if (this.acHealthMaint[i].test_category.toString().toUpperCase() == "COMMON TEST") {
                        commonTestCount++;
                        if (commonTestCount > 0 && commonTestCount % 2 == 0)
                            strCommonTestHTML += "<tr class='styleAlternateRowColor'>";
                        else
                            strCommonTestHTML += "<tr>";


                        strCommonTestHTML += "<td valign='top'><span class='styleNormalBold'>" + this.acHealthMaint[i].test_name + "</span></td>";

                        if (this.acHealthMaint[i].refusal == "1") {
                            strCommonTestHTML += "<td valign='top' colspan='2'  >Refused</td>";
                        }
                        else {
                            strCommonTestHTML += "<td valign='top'>" + this.acHealthMaint[i].test_date + "</td>";
                            strCommonTestHTML += "<td valign='top'>" + this.acHealthMaint[i].due_date + "</td>";
                        }
                        strCommonTestHTML += "<td valign='top'>" + this.generalOperation.ReplaceHTMLReservedWords(this.acHealthMaint[i].test_value) + "</td>" +
                            " </tr>";
                    }
                    else if (this.acHealthMaint[i].test_category.toString().toUpperCase() == "CUSTOM TEST") {
                        customTestCount++;
                        if (customTestCount > 0 && customTestCount % 2 == 0)
                            strCustomTestHTML += "<tr class='styleAlternateRowColor'>";
                        else
                            strCustomTestHTML += "<tr>";

                        strCustomTestHTML += "<td valign='top'><span class='styleNormalBold'>" + this.acHealthMaint[i].test_name + "</span></td>";

                        if (this.acHealthMaint[i].refusal == "1") {
                            strCustomTestHTML += "<td valign='top' colspan='2'  >Refused</td>";
                        }
                        else {
                            strCustomTestHTML += "<td valign='top'>" + this.acHealthMaint[i].test_date + "</td>";
                            strCustomTestHTML += "<td valign='top'>" + this.acHealthMaint[i].due_date + "</td>";
                        }
                        strCustomTestHTML += "<td valign='top'>" + this.generalOperation.ReplaceHTMLReservedWords(this.acHealthMaint[i].test_value) + "</td>" +
                            " </tr>";
                    }
                    else if (this.acHealthMaint[i].test_category.toString().toUpperCase() == "OTHER TESTS") {
                        otherTestCount++;
                        if (otherTestCount > 0 && otherTestCount % 2 == 0)
                            strOtherTestHTML += "<tr class='styleAlternateRowColor'>";
                        else
                            strOtherTestHTML += "<tr>";

                        strOtherTestHTML += "<td valign='top'><span class='styleNormalBold'>" + this.acHealthMaint[i].test_name + "</span></td>";

                        if (this.acHealthMaint[i].refusal == "1") {
                            strOtherTestHTML += "<td valign='top' colspan='2'  >Refused</td>";
                        }
                        else {
                            strOtherTestHTML += "<td valign='top'>" + this.acHealthMaint[i].test_date + "</td>";
                            strOtherTestHTML += "<td valign='top'>" + this.acHealthMaint[i].due_date + "</td>";
                        }
                        strOtherTestHTML += "<td valign='top'>" + this.generalOperation.ReplaceHTMLReservedWords(this.acHealthMaint[i].test_value) + "</td>" +
                            " </tr>";
                    }
                    else if (this.acHealthMaint[i].test_category.toString().toUpperCase() == "VACCINATION") {
                        vaccineTestCount++;
                        if (vaccineTestCount > 0 && vaccineTestCount % 2 == 0)
                            strVaccinationHTML += "<tr class='styleAlternateRowColor'>";
                        else
                            strVaccinationHTML += "<tr>";

                        strVaccinationHTML += "<td valign='top'><span class='styleNormalBold'>" + this.acHealthMaint[i].test_name + "</span></td>";

                        if (this.acHealthMaint[i].refusal == "1") {
                            strVaccinationHTML += "<td valign='top' colspan='2'  >Refused</td>";
                        }
                        else {
                            strVaccinationHTML += "<td valign='top'>" + this.acHealthMaint[i].test_date + "</td>";
                            strVaccinationHTML += "<td valign='top'>" + this.acHealthMaint[i].due_date + "</td>";
                        }
                        strVaccinationHTML += "<td valign='top'>" + this.generalOperation.ReplaceHTMLReservedWords(this.acHealthMaint[i].test_value) + "</td>" +
                            " </tr>";
                    }
                    else if (this.acHealthMaint[i].test_category.toString().toUpperCase() == "LIPIDS") {
                        lipidsTestCount++;
                        if (lipidsTestCount > 0 && lipidsTestCount % 2 == 0)
                            strLipidsHTML += "<tr class='styleAlternateRowColor'>";
                        else
                            strLipidsHTML += "<tr>";

                        strLipidsHTML += "<td valign='top'><span class='styleNormalBold'>" + this.acHealthMaint[i].test_name + "</span></td>";

                        if (this.acHealthMaint[i].refusal == "1") {
                            strLipidsHTML += "<td valign='top' colspan='2'  >Refused</td>";
                        }
                        else {
                            strLipidsHTML += "<td valign='top'>" + this.acHealthMaint[i].test_date + "</td>";
                            strLipidsHTML += "<td valign='top'>" + this.acHealthMaint[i].due_date + "</td>";
                        }
                        strLipidsHTML += "<td valign='top'>" + this.generalOperation.ReplaceHTMLReservedWords(this.acHealthMaint[i].test_value) + "</td>" +
                            " </tr>";
                    }

                }

                if (strCommonTestHTML != "") {
                    this.strHTMLPatientHealthMent += "<tr><td colspan='4'><span class='styleNormalBold'><u>Common Tests:</u></span></td></tr>";
                    this.strHTMLPatientHealthMent += strCommonTestHTML;
                }
                if (strCustomTestHTML != "") {
                    this.strHTMLPatientHealthMent += "<tr><td colspan='4'><span class='styleNormalBold'><u>Custom Tests:</u></span></td></tr>";
                    this.strHTMLPatientHealthMent += strCustomTestHTML;
                }
                if (strOtherTestHTML != "") {
                    this.strHTMLPatientHealthMent += "<tr><td colspan='4'><span class='styleNormalBold'><u>Other Tests:</u></span></td></tr>";
                    this.strHTMLPatientHealthMent += strOtherTestHTML;
                }
                if (strVaccinationHTML != "") {
                    this.strHTMLPatientHealthMent += "<tr><td colspan='4'><span class='styleNormalBold'><u>Vaccination:</u></span></td></tr>";
                    this.strHTMLPatientHealthMent += strVaccinationHTML;
                }
                if (strLipidsHTML != "") {
                    this.strHTMLPatientHealthMent += "<tr><td colspan='4'><span class='styleNormalBold'><u>Lipids:</u></span></td></tr>";
                    this.strHTMLPatientHealthMent += strLipidsHTML;
                }

                this.strHTMLPatientHealthMent += "</tbody></table>";
                this.strHtmlString += this.strHTMLPatientHealthMent;
                this.strHtmlString += this.strModuleGap;
            }
        }
        catch (e) {
            this.logMessage.log("HealthMaint-HTML" + e);
        }
    }
    pastMedHistory_Print() {
        try {
            var count = 1;
            var i = 0;
            var strNewRow: string = "<tr>";
            if (this.acPastMedHist != null && this.acPastMedHist.length > 0) {
                this.strHTMLPastMedicalHistory = " <table width='98%' class='tableMain'> <tbody>" +
                    "<tr>" +
                    "<th colspan='4'>PMH</th>" +
                    "</tr>" +
                    "<tr class='styleModuleSubHeader'>" +
                    "<td width='10'></td>" +
                    "<td width ='65'>Date</td>" +
                    "<td width ='70' >Code</td>" +
                    "<td>Description</td>" +
                    "</tr>";

                for (i = 0; i < this.acPastMedHist.length; i++) {
                    var PMHdate: String = (this.acPastMedHist[i].date != null && this.acPastMedHist[i].date != "01/01/1900") ? this.acPastMedHist[i].date : "";

                    if (count > 0 && count % 2 == 0)
                        strNewRow = "<tr class='styleAlternateRowColor'>";
                    else
                        strNewRow = "<tr>";

                    if ((PMHdate != null && PMHdate != "") || (this.acPastMedHist[i].code != null && this.acPastMedHist[i].code != "")) {
                        this.strHTMLPastMedicalHistory += strNewRow;
                        this.strHTMLPastMedicalHistory += " <td valign='top'>" + count + "</td> ";
                        this.strHTMLPastMedicalHistory += " <td valign='top'>" + PMHdate + "</td> ";
                        this.strHTMLPastMedicalHistory += " <td valign='top'>" + this.acPastMedHist[i].code.trim() + "</td> ";
                        this.strHTMLPastMedicalHistory += " <td valign='top'>" + this.generalOperation.ReplaceHTMLReservedWords(this.acPastMedHist[i].description) + "</td> ";
                        this.strHTMLPastMedicalHistory += " </tr> ";

                        if (this.acPastMedHist[i].notes.trim() != "") {
                            this.strHTMLPastMedicalHistory += strNewRow;
                            this.strHTMLPastMedicalHistory += "<td></td><td colspan='3'><span class='styleNormalBold'>Detail:</span>" +
                                this.generalOperation.ReplaceAll(this.generalOperation.ReplaceHTMLReservedWords(this.acPastMedHist[i].notes), "\n", "<br>") + "</td> </tr> ";
                        }
                    }
                    else if (this.acPastMedHist[i].notes.trim() != "") {
                        this.strHTMLPastMedicalHistory += strNewRow + "<td valign='top'>" + count + "</td><td colspan='3'><span class='styleNormalBold'>Detail:</span>" + this.generalOperation.ReplaceAll(this.generalOperation.ReplaceHTMLReservedWords(this.acPastMedHist[i].notes), "\n", "<br>") + "</td> </tr> ";
                    }
                    count++;
                }
                this.strHTMLPastMedicalHistory += "</tbody></table> ";
                this.strHtmlString += this.strHTMLPastMedicalHistory;
                this.strHtmlString += this.strModuleGap;
            }
        }
        catch (e) {
            this.logMessage.log("PastMedicalHX-HTML" + e);
        }
    }
    Assessment_Print() {
        try {
            var count = 1;
            var i = 0;
            var strNewRow: String = "<tr>";
            if (this.acAssessments != null) {
                if (this.acAssessments.length > 0) {
                    this.strHTMLPastMedicalHistory = "<table width='98%' class='tableMain'> " +
                        "<tbody >" +
                        "	<tr >" +
                        "		<th colspan='4'>Assessments</th>" +
                        "	</tr>" +
                        "		<tr  class='styleModuleSubHeader'>" +
                        "		<td width='10'></td>" +
                        "		<td width='60'>Date</td>" +
                        "		<td>Code</td>" +
                        "		<td>Description</td>" +
                        "	</tr>";


                    for (i = 0; i < this.acAssessments.length; i++) {
                        var PMHdate: String = (this.acAssessments[i].date != null && this.acAssessments[i].date != "01/01/1900") ? this.acAssessments[i].date : "";

                        if (i % 2 == 1)
                            strNewRow = "<tr class='styleAlternateRowColor'>";
                        else
                            strNewRow = "<tr>";

                        this.strHTMLPastMedicalHistory += strNewRow;

                        this.strHTMLPastMedicalHistory += " <td align='left'  valign='top'>" + count + "</td> " +
                            " <td valign='top'>" + PMHdate + "</td> " +
                            " <td valign='top'>" + this.acAssessments[i].code.trim() + "</td> " +
                            " <td valign='top'>" + this.generalOperation.ReplaceHTMLReservedWords(this.acAssessments[i].description) + "</td>" +
                            " </tr> ";

                        if (this.acAssessments[i].notes.trim() != "") {
                            this.strHTMLPastMedicalHistory += strNewRow;
                            this.strHTMLPastMedicalHistory += " <td></td>";
                            this.strHTMLPastMedicalHistory += " <td coslpan='4' valign='top'><span class='styleNormalBold'>Notes:&nbsp;</span>" + this.generalOperation.ReplaceHTMLReservedWords(this.acAssessments[i].notes) + "</td>" +
                                " </tr> ";
                        }
                        count++;
                    }

                    this.strHTMLPastMedicalHistory += " </tbody></table>";
                    this.strHtmlString += this.strHTMLPastMedicalHistory;
                    this.strHtmlString += this.strModuleGap;

                }
            }
        }
        catch (e) {
            this.logMessage.log("Assessments-HTML" + e);
        }
    }
    Patient_FollowUp_Print() {
        try {
            this.strHTMLPatientFollowUp = "";
            var count = 1;
            if (this.acPatFollowup.length > 0) {
                this.strHTMLPatientFollowUp = " <table width='98%' class='tableMain'> <tbody>" +
                    "<tr>" +
                    "<th colspan='4'>Follow Up</th>" +
                    "</tr>" +
                    "<tr class='styleModuleSubHeader'>" +
                    "<td width='10'></td>" +
                    "<td width ='65'>Date</td>" +
                    "<td width ='70' >Code</td>" +
                    "<td>Description</td>" +
                    "</tr>";
                var strCount: string;

                for (var i = 0; i < this.acPatFollowup.length; i++) {
                    var dt: string = (this.acPatFollowup[i].date != null && this.acPatFollowup[i].date != "01/01/1900") ? this.acPatFollowup[i].date : "";
                    var code_type: string = (this.acPatFollowup[i].code_type != null) ? this.acPatFollowup[i].code_type : "";
                    var code: string = (this.acPatFollowup[i].code != null) ? this.acPatFollowup[i].code : "";
                    var des: string = (this.acPatFollowup[i].description != null) ? this.acPatFollowup[i].description : "";
                    var comments: string = (this.acPatFollowup[i].comments != null) ? this.acPatFollowup[i].comments : "";
                    if (code != "") {

                        if (count > 0 && count % 2 == 0)
                            this.strHTMLPatientFollowUp += "<tr class='styleAlternateRowColor'>";
                        else
                            this.strHTMLPatientFollowUp += "<tr>";

                        this.strHTMLPatientFollowUp += "<td valign='top' ><span class='styleNormal'>" + count + "</span></td>" +
                            "<td valign='top' ><span class='styleNormal'>" + dt + "</span></td>" +
                            "<td valign='top' ><span class='styleNormal'>" + code + "</span></td>" +
                            "<td valign='top' ><span class='styleNormal'>" + des + "</span></td>" +
                            "</tr>";

                        if (comments != "") {
                            if (count > 0 && count % 2 == 0)
                                this.strHTMLPatientFollowUp += "<tr class='styleAlternateRowColor'>";
                            else
                                this.strHTMLPatientFollowUp += "<tr>";

                            this.strHTMLPatientFollowUp += "<td valign='top' ></td>" +
                                "<td valign='top' colspan='3' ><span class='styleNormalBold'>Notes:</span><span class='styleNormal'>" + this.generalOperation.ReplaceAll(this.generalOperation.ReplaceHTMLReservedWords(comments), "\n", "<br>") + "</span></td>" +
                                "</tr>";
                        }
                        count++;
                    }
                }
                this.strHTMLPatientFollowUp += "</tbody></table>";
                this.strHtmlString += this.strHTMLPatientFollowUp;
                this.strHtmlString += this.strModuleGap;
            }
        }
        catch (e) {
            this.logMessage.log("Patient Followup-HTML" + e);
        }
    }
    Patient_LabOrderTest_Print() {
        try {
            if (this.acLabOrderTest != null && this.acLabOrderTest.length > 0) {
                this.strHTMLPatientLabOrderTest = " <table width='98%' class='tableMain'> <tbody>" +
                    "<tr>" +
                    "<th colspan='3'>Lab Order Test(s)</th>" +
                    "</tr>" +
                    "<tr class='styleModuleSubHeader'>" +
                    "<td width='10'></td>" +
                    "<td width ='70'>CPT Code</td>" +
                    "<td>Description</td>" +
                    "</tr>";
                var i = 0;
                for (i = 0; i < this.acLabOrderTest.length; i++) {
                    var count = i + 1;
                    if (count > 0 && count % 2 == 0)
                        this.strHTMLPatientLabOrderTest += "<tr class='styleAlternateRowColor'>";
                    else
                        this.strHTMLPatientLabOrderTest += "<tr>";

                    this.strHTMLPatientLabOrderTest += " <td valign='top'> " + count + " </td> " +
                        " <td  width='80' valign='top'> " + this.acLabOrderTest[i].id + " </td>  " +
                        " <td valign='top'> " + this.generalOperation.ReplaceHTMLReservedWords(this.acLabOrderTest[i].name) + " </td> " +
                        " </tr> ";
                }
                this.strHTMLPatientLabOrderTest += " </tbody></table>";
                this.strHtmlString += this.strHTMLPatientLabOrderTest;
                this.strHtmlString += this.strModuleGap;
            }
        }
        catch (e) {
            this.logMessage.log("LabOrderPrint-HTML" + e);
        }
    }
    Patient_OfficeTest_Print() {
        try {
            if (this.acOfficeTest != null && this.acOfficeTest.length > 0) {
                this.strHTMLPatientOfficeTest = "<table width='98%' class='tableMain'> <tbody>" +
                    "<tr>" +
                    "<th colspan='4'>Office Tests Order</th>" +
                    "</tr>";
                //"<tr>"+								
                //"	<td valign='top'>"+								
                //"	<table width='100%' class='tableNoBorder'>";					

                var no = 0;
                if (this.acOfficeTest[0].fasting != "" || this.acOfficeTest[0].random != "" || this.acOfficeTest[0].post_prandial != "") {
                    this.strHTMLPatientOfficeTest += "<tr >" +
                        "	<td class='styleModuleSubHeader' colspan='4'>Blood Glucose</td>" +
                        "</tr>";
                    this.strHTMLPatientOfficeTest += "<tr>";

                    if (this.acOfficeTest[0].fasting != "" && this.acOfficeTest[0].fasting != null) {

                        no++;
                        this.strHTMLPatientOfficeTest += " <td valign='top'> " +
                            " <span class='styleNormalBold'>Fasting:&nbsp;</span><span class='styleNormal'>" + this.acOfficeTest[0].fasting + "</span>" +
                            " </td>";
                    }

                    if (this.acOfficeTest[0].random != "" && this.acOfficeTest[0].random != null) {

                        no++;
                        this.strHTMLPatientOfficeTest += " <td valign='top'> " +
                            " <span class='styleNormalBold'>Random:&nbsp;</span><span class='styleNormal'>" + this.acOfficeTest[0].random + "</span>" +
                            " </td>";
                    }


                    if (this.acOfficeTest[0].post_prandial != "" && this.acOfficeTest[0].post_prandial != null) {

                        no++;
                        this.strHTMLPatientOfficeTest += " <td valign='top'> " +
                            " <span class='styleNormalBold'>Post Prandial:&nbsp;</span><span class='styleNormal'>" + this.acOfficeTest[0].post_prandial + "</span>" +
                            " </td>";
                    }

                    if (no > 0 && no % 4 != 0) {
                        while (no % 4 != 0) {
                            this.strHTMLPatientOfficeTest += "<td valign='top'></td>";
                            no++;
                        }
                    }
                    this.strHTMLPatientOfficeTest += " </tr> ";
                }
                if (this.acOfficeTest[0].left_vesion != "" || this.acOfficeTest[0].right_vesion != "") {
                    no = 0;

                    this.strHTMLPatientOfficeTest += "<tr >" +
                        "	<td class='styleModuleSubHeader' colspan='4'>Vision</td>" +
                        "</tr>";
                    this.strHTMLPatientOfficeTest += "<tr>";

                    if (this.acOfficeTest[0].left_vesion != "" && this.acOfficeTest[0].left_vesion != null) {

                        this.strHTMLPatientOfficeTest += " <td valign='top'> " +
                            " <span class='styleNormalBold'>Left:&nbsp;</span><span class='styleNormal'>" + this.acOfficeTest[0].left_vesion + "</span>" +
                            " </td>";
                    }


                    if (this.acOfficeTest[0].right_vesion != "" && this.acOfficeTest[0].right_vesion != null) {
                        this.strHTMLPatientOfficeTest += " <td valign='top'> " +
                            " <span class='styleNormalBold'>Right:&nbsp;</span><span class='styleNormal'>" + this.acOfficeTest[0].right_vesion + "</span>" +
                            " </td>";
                    }


                    if (no > 0 && no % 4 != 0) {
                        while (no % 4 != 0) {
                            this.strHTMLPatientOfficeTest += "<td valign='top'></td>";
                            no++;
                        }
                    }

                    this.strHTMLPatientOfficeTest += "</tr> ";
                }//end vision.
                if (this.acOfficeTest[0].ogtt_1 != "" || this.acOfficeTest[0].ogtt_2 != "" || this.acOfficeTest[0].ogtt_3 != "" || this.acOfficeTest[0].ogtt_4 != "") {

                    this.strHTMLPatientOfficeTest += "<tr >" +
                        "	<td class='styleModuleSubHeader' colspan='4'>OGTT/GTT</td>" +
                        "</tr>";
                    this.strHTMLPatientOfficeTest += "<tr>";
                    if (this.acOfficeTest[0].ogtt_1 != "" && this.acOfficeTest[0].ogtt_1 != null) {

                        this.strHTMLPatientOfficeTest += " <td valign='top'> " +
                            " <span class='styleNormal'>" + this.acOfficeTest[0].ogtt_1 + "</span>" +
                            " </td>";
                    }


                    if (this.acOfficeTest[0].ogtt_2 != "") {

                        this.strHTMLPatientOfficeTest += " <td valign='top'> " +
                            " <span class='styleNormal'>" + this.acOfficeTest[0].ogtt_2 + "</span>" +
                            " </td>";
                    }


                    if (this.acOfficeTest[0].ogtt_3 != "") {

                        this.strHTMLPatientOfficeTest += " <td  > " +
                            " <span class='styleNormal'>" + this.acOfficeTest[0].ogtt_3 + "</span>" +
                            " </td>";
                    }


                    if (this.acOfficeTest[0].ogtt_4 != "") {

                        this.strHTMLPatientOfficeTest += " <td valign='top'> " +
                            " <span class='styleNormal'>" + this.acOfficeTest[0].ogtt_4 + "</span>" +
                            " </td>";
                    }


                    if (no > 0 && no % 4 != 0) {
                        while (no % 4 != 0) {
                            this.strHTMLPatientOfficeTest += "<td valign='top'></td>";
                            no++;
                        }
                    }

                    this.strHTMLPatientOfficeTest += "</tr> ";
                }//end OGTT/GTT

                if (this.acOfficeTest[0].pregnancy != "" || this.acOfficeTest[0].strip != "" || this.acOfficeTest[0].lmp != "") {

                    this.strHTMLPatientOfficeTest += "<tr >" +
                        "	<td class='styleModuleSubHeader' colspan='4'>OB/GYN</td>" +
                        "</tr>";
                    this.strHTMLPatientOfficeTest += "<tr>";
                    if (this.acOfficeTest[0].pregnancy == 1) {

                        this.strHTMLPatientOfficeTest += " <td valign='top'> " +
                            " <span class='styleNormalBold'>Pregnancy:&nbsp;</span><span class='styleNormal'>Positive</span>" +
                            " </td>";

                    }
                    else if (this.acOfficeTest[0].pregnancy == 0) {

                        this.strHTMLPatientOfficeTest += " <td valign='top'> " +
                            " <span class='styleNormalBold'>Pregnancy:&nbsp;</span><span class='styleNormal'>Negative</span>" +
                            " </td>";
                    }

                    if (this.acOfficeTest[0].strip == 1) {

                        this.strHTMLPatientOfficeTest += " <td valign='top'> " +
                            " <span class='styleNormalBold'>STREP:&nbsp;</span><span class='styleNormal'>Positive</span>" +
                            " </td>";
                    }
                    else if (this.acOfficeTest[0].strip == 0) {

                        this.strHTMLPatientOfficeTest += " <td valign='top'> " +
                            " <span class='styleNormalBold'>STREP:&nbsp;</span><span class='styleNormal'>Negative</span>" +
                            " </td>";
                    }

                    if (this.acOfficeTest[0].lmp != "") {

                        this.strHTMLPatientOfficeTest += " <td valign='top'> " +
                            " <span class='styleNormalBold'>LMP:&nbsp;</span><span class='styleNormal'>" + this.acOfficeTest[0].lmp + "</span>" +
                            " </td>";

                    }

                    if (no > 0 && no % 4 != 0) {
                        while (no % 4 != 0) {
                            this.strHTMLPatientOfficeTest += "<td valign='top'></td>";
                            no++;
                        }
                    }

                    this.strHTMLPatientOfficeTest += " </tr> ";
                }//end ob/gyn

                if (this.acOfficeTest[0].glucose != "" || this.acOfficeTest[0].bilirubin != "" || this.acOfficeTest[0].kenton != ""
                    || this.acOfficeTest[0].sp_gravity != "" || this.acOfficeTest[0].blood != "" || this.acOfficeTest[0].ph != ""
                    || this.acOfficeTest[0].protein != "" || this.acOfficeTest[0].urobilinogen != "" || this.acOfficeTest[0].nitrate != ""
                    || this.acOfficeTest[0].leukoctes != "") {


                    no = 0;
                    this.strHTMLPatientOfficeTest += "<tr >" +
                        "	<td class='styleModuleSubHeader' colspan='4'>U/A</td>" +
                        "</tr>";
                    this.strHTMLPatientOfficeTest += "<tr>";

                    if (this.acOfficeTest[0].glucose != "") {


                        if (no > 0 && no % 4 == 0) {
                            this.strHTMLPatientOfficeTest += "</tr><tr>";
                        }


                        this.strHTMLPatientOfficeTest += " <td valign='top'> " +
                            " <span class='styleNormalBold'>Glucose:&nbsp;</span><span class='styleNormal'>" + this.acOfficeTest[0].glucose + "</span>" +
                            " </td>";

                        no++;
                    }

                    if (this.acOfficeTest[0].bilirubin != "") {

                        if (no > 0 && no % 4 == 0) {
                            this.strHTMLPatientOfficeTest += "</tr><tr>";
                        }
                        this.strHTMLPatientOfficeTest += " <td valign='top'> " +
                            " <span class='styleNormalBold'>Bilirubin:&nbsp;</span><span class='styleNormal'>" + this.acOfficeTest[0].bilirubin + "</span>" +
                            " </td>";

                        no++
                    }


                    if (this.acOfficeTest[0].kenton != "") {

                        if (no > 0 && no % 4 == 0) {
                            this.strHTMLPatientOfficeTest += "</tr><tr>";
                        }

                        this.strHTMLPatientOfficeTest += " <td valign='top'> " +
                            " <span class='styleNormalBold'>Ketone:&nbsp;</span><span class='styleNormal'>" + this.acOfficeTest[0].kenton + "</span>" +
                            " </td>";

                        no++
                    }
                    if (this.acOfficeTest[0].sp_gravity != "") {

                        if (no > 0 && no % 4 == 0) {
                            this.strHTMLPatientOfficeTest += "</tr><tr>";
                        }

                        this.strHTMLPatientOfficeTest += " <td valign='top'> " +
                            " <span class='styleNormalBold'>Gravity:&nbsp;</span><span class='styleNormal'>" + this.acOfficeTest[0].sp_gravity + "</span>" +
                            " </td>";
                        no++;
                    }

                    if (this.acOfficeTest[0].blood != "") {

                        if (no > 0 && no % 4 == 0) {
                            this.strHTMLPatientOfficeTest += "</tr><tr>";
                        }

                        this.strHTMLPatientOfficeTest += " <td valign='top'> " +
                            " <span class='styleNormalBold'>Blood:&nbsp;</span><span class='styleNormal'>" + this.acOfficeTest[0].blood + "</span>" +
                            " </td>";

                        no++;
                    }

                    if (this.acOfficeTest[0].ph != "") {

                        if (no > 0 && no % 4 == 0) {
                            this.strHTMLPatientOfficeTest += "</tr><tr>";
                        }
                        this.strHTMLPatientOfficeTest += " <td valign='top'> " +
                            " <span class='styleNormalBold'>PH:&nbsp;</span><span class='styleNormal'>" + this.acOfficeTest[0].ph + "</span>" +
                            " </td>";

                        no++;
                    }

                    if (this.acOfficeTest[0].protein != "") {

                        if (no > 0 && no % 4 == 0) {
                            this.strHTMLPatientOfficeTest += "</tr><tr>";
                        }

                        this.strHTMLPatientOfficeTest += " <td valign='top'> " +
                            " <span class='styleNormalBold'>Protein:&nbsp;</span><span class='styleNormal'>" + this.acOfficeTest[0].protein + "</span>" +
                            " </td>";

                        no++
                    }
                    if (this.acOfficeTest[0].urobilinogen != "") {


                        if (no > 0 && no % 4 == 0) {
                            this.strHTMLPatientOfficeTest += "</tr><tr>";
                        }

                        this.strHTMLPatientOfficeTest += " <td valign='top'> " +
                            " <span class='styleNormalBold'>Urobilinogen:&nbsp;</span><span class='styleNormal'>" + this.acOfficeTest[0].urobilinogen + "</span>" +
                            " </td>";

                        no++;
                    }

                    if (this.acOfficeTest[0].nitrate != "") {

                        if (no > 0 && no % 4 == 0) {
                            this.strHTMLPatientOfficeTest += "</tr><tr>";
                        }

                        this.strHTMLPatientOfficeTest += " <td valign='top'> " +
                            " <span class='styleNormalBold'>Nitrate:&nbsp;</span><span class='styleNormal'>" + this.acOfficeTest[0].nitrate + "</span>" +
                            " </td>";

                        no++

                    }
                    if (this.acOfficeTest[0].leukoctes != "" && this.acOfficeTest[0].leukoctes != null) {

                        if (no > 0 && no % 4 == 0) {
                            this.strHTMLPatientOfficeTest += "</tr><tr>";
                        }

                        this.strHTMLPatientOfficeTest += " <td valign='top'> " +
                            " <span class='styleNormalBold'>Leukocytes:&nbsp;</span><span class='styleNormal'>" + this.acOfficeTest[0].leukoctes + "</span>" +
                            " </td>";

                        no++
                    }

                    if (no > 0 && no % 4 != 0) {
                        while (no % 4 != 0) {
                            this.strHTMLPatientOfficeTest += "<td valign='top'></td>";
                            no++;
                        }
                    }

                    this.strHTMLPatientOfficeTest += " </tr> ";
                }//end U/A

                if (this.acOfficeTest[0].hear_level_20 != 0 || this.acOfficeTest[0].hear_level_25 != 0 ||
                    this.acOfficeTest[0].hear_level_40 != 0 ||
                    this.acOfficeTest[0].ritht_ear_500 != null || this.acOfficeTest[0].ritht_ear_1000 != null ||
                    this.acOfficeTest[0].ritht_ear_2000 != null || this.acOfficeTest[0].ritht_ear_4000 != null ||
                    this.acOfficeTest[0].left_ear_500 != null || this.acOfficeTest[0].left_ear_1000 != null ||
                    this.acOfficeTest[0].left_ear_2000 != null || this.acOfficeTest[0].left_ear_4000 != null
                ) {


                    this.strHTMLPatientOfficeTest += "<tr >" +
                        "	<td class='styleModuleSubHeader' colspan='4'>Hearing</td>" +
                        "</tr>";

                    var hear_level: String = "";
                    if (this.acOfficeTest[0].hear_level_20 == 1) {
                        hear_level = "20 db HL";
                    }
                    else if (this.acOfficeTest[0].hear_level_25 == 1) {
                        hear_level = "25 db HL";
                    }
                    else if (this.acOfficeTest[0].hear_level_40 == 1) {
                        hear_level = "40 db HL";
                    }

                    this.strHTMLPatientOfficeTest += "<tr>" +
                        "<td colspan='4'>" +
                        "<table width='50%' style='border:1px solid #5bb6d0;border-collapse:collapse' >" +
                        "<tr style='border:1px solid #5bb6d0'>" +
                        "<td style='border:1px solid #5bb6d0'><span class='styleNormalBold'>Level</span></td>" +
                        "<td style='border:1px solid #5bb6d0' colspan='4'><span class='styleNormal'>" + hear_level + "</span></td>" +
                        "</tr>";


                    this.strHTMLPatientOfficeTest += "<tr style='border:1px solid #5bb6d0'>" +
                        "<td style='border:1px solid #5bb6d0'><span class='styleNormalBold'>Right Year</span></td>";

                    if (this.acOfficeTest[0].ritht_ear_500 == 1) {
                        this.strHTMLPatientOfficeTest += "<td style='border:1px solid #5bb6d0' align='center' ><span class='styleNormal'>Yes</span></td>";
                    }
                    else if (this.acOfficeTest[0].ritht_ear_500 == 0) {
                        this.strHTMLPatientOfficeTest += "<td style='border:1px solid #5bb6d0' align='center' ><span class='styleNormal'>No</span></td>";
                    }
                    else {
                        this.strHTMLPatientOfficeTest += "<td style='border:1px solid #5bb6d0' align='center' ></td>";
                    }

                    if (this.acOfficeTest[0].ritht_ear_1000 == 1) {
                        this.strHTMLPatientOfficeTest += "<td style='border:1px solid #5bb6d0' align='center' ><span class='styleNormal'>Yes</span></td>";
                    }
                    else if (this.acOfficeTest[0].ritht_ear_1000 == 0) {
                        this.strHTMLPatientOfficeTest += "<td style='border:1px solid #5bb6d0' align='center' ><span class='styleNormal'>No</span></td>";
                    }
                    else {
                        this.strHTMLPatientOfficeTest += "<td style='border:1px solid #5bb6d0' align='center' ></td>";
                    }

                    if (this.acOfficeTest[0].ritht_ear_2000 == 1) {
                        this.strHTMLPatientOfficeTest += "<td style='border:1px solid #5bb6d0' align='center' ><span class='styleNormal'>Yes</span></td>";
                    }
                    else if (this.acOfficeTest[0].ritht_ear_2000 == 0) {
                        this.strHTMLPatientOfficeTest += "<td style='border:1px solid #5bb6d0' align='center' ><span class='styleNormal'>No</span></td>";
                    }
                    else {
                        this.strHTMLPatientOfficeTest += "<td style='border:1px solid #5bb6d0' align='center' ></td>";
                    }

                    if (this.acOfficeTest[0].ritht_ear_4000 == 1) {
                        this.strHTMLPatientOfficeTest += "<td style='border:1px solid #5bb6d0' align='center' ><span class='styleNormal'>Yes</span></td>";
                    }
                    else if (this.acOfficeTest[0].ritht_ear_4000 == 0) {
                        this.strHTMLPatientOfficeTest += "<td style='border:1px solid #5bb6d0' align='center' ><span class='styleNormal'>No</span></td>";
                    }
                    else {
                        this.strHTMLPatientOfficeTest += "<td style='border:1px solid #5bb6d0' align='center' ></td>";
                    }

                    this.strHTMLPatientOfficeTest += "</tr>";

                    this.strHTMLPatientOfficeTest += "<tr style='border:1px solid #5bb6d0'>" +
                        "<td style='border:1px solid #5bb6d0'><span class='styleNormalBold'>Left Year</span></td>";

                    if (this.acOfficeTest[0].left_ear_500 == 1) {
                        this.strHTMLPatientOfficeTest += "<td style='border:1px solid #5bb6d0' align='center' ><span class='styleNormal'>Yes</span></td>";
                    }
                    else if (this.acOfficeTest[0].left_ear_500 == 0) {
                        this.strHTMLPatientOfficeTest += "<td style='border:1px solid #5bb6d0' align='center' ><span class='styleNormal'>No</span></td>";
                    }
                    else {
                        this.strHTMLPatientOfficeTest += "<td style='border:1px solid #5bb6d0' align='center' ></td>";
                    }

                    if (this.acOfficeTest[0].left_ear_1000 == 1) {
                        this.strHTMLPatientOfficeTest += "<td style='border:1px solid #5bb6d0' align='center' ><span class='styleNormal'>Yes</span></td>";
                    }
                    else if (this.acOfficeTest[0].left_ear_1000 == 0) {
                        this.strHTMLPatientOfficeTest += "<td style='border:1px solid #5bb6d0' align='center' ><span class='styleNormal'>No</span></td>";
                    }
                    else {
                        this.strHTMLPatientOfficeTest += "<td style='border:1px solid #5bb6d0' align='center' ></td>";
                    }

                    if (this.acOfficeTest[0].left_ear_2000 == 1) {
                        this.strHTMLPatientOfficeTest += "<td style='border:1px solid #5bb6d0' align='center' ><span class='styleNormal'>Yes</span></td>";
                    }
                    else if (this.acOfficeTest[0].left_ear_2000 == 0) {
                        this.strHTMLPatientOfficeTest += "<td style='border:1px solid #5bb6d0' align='center' ><span class='styleNormal'>No</span></td>";
                    }
                    else {
                        this.strHTMLPatientOfficeTest += "<td style='border:1px solid #5bb6d0' align='center' ></td>";
                    }

                    if (this.acOfficeTest[0].left_ear_4000 == 1) {
                        this.strHTMLPatientOfficeTest += "<td style='border:1px solid #5bb6d0' align='center' ><span class='styleNormal'>Yes</span></td>";
                    }
                    else if (this.acOfficeTest[0].left_ear_4000 == 0) {
                        this.strHTMLPatientOfficeTest += "<td style='border:1px solid #5bb6d0' align='center' ><span class='styleNormal'>No</span></td>";
                    }
                    else {
                        this.strHTMLPatientOfficeTest += "<td style='border:1px solid #5bb6d0' align='center' ></td>";
                    }

                    this.strHTMLPatientOfficeTest += "</tr>";



                    this.strHTMLPatientOfficeTest += "<tr style='border:1px solid #5bb6d0'>" +
                        "<td style='border:1px solid #5bb6d0'><span class='styleNormalBold'>PH</span></td>" +
                        "<td style='border:1px solid #5bb6d0' align='center' ><span class='styleNormalBold'>500</span></td>" +
                        "<td style='border:1px solid #5bb6d0' align='center' ><span class='styleNormalBold'>1000</span></td>" +
                        "<td style='border:1px solid #5bb6d0' align='center' ><span class='styleNormalBold'>2000</span></td>" +
                        "<td style='border:1px solid #5bb6d0' align='center' ><span class='styleNormalBold'>4000</span></td>" +
                        "</tr>";



                    this.strHTMLPatientOfficeTest += "</table></td></tr>";

                }//end Hearing

                if (this.acOfficeTest[0].spirometry != "" || this.acOfficeTest[0].hemoglobin != "" || this.acOfficeTest[0].fluoride != "" || this.acOfficeTest[0].lead_screening) {

                    no = 0;
                    this.strHTMLPatientOfficeTest += "<tr >" +
                        "	<td class='styleModuleSubHeader' colspan='4'>Other</td>" +
                        "</tr>";
                    this.strHTMLPatientOfficeTest += "<tr>";
                    if (this.acOfficeTest[0].spirometry != "") {
                        this.strHTMLPatientOfficeTest += " <td valign='top'> " +
                            " <span class='styleNormalBold'>Spirometry Result:&nbsp;</span><span class='styleNormal'>" + this.acOfficeTest[0].spirometry + "</span>" +
                            " </td>";
                        no++;
                    }

                    if (this.acOfficeTest[0].spirometry != "") {
                        this.strHTMLPatientOfficeTest += " <td valign='top'> " +
                            " <span class='styleNormalBold'>Hemoglobin:&nbsp;</span><span class='styleNormal'>" + this.acOfficeTest[0].hemoglobin + "</span>" +
                            " </td>";
                        no++;
                    }

                    if (this.acOfficeTest[0].spirometry != "") {
                        this.strHTMLPatientOfficeTest += " <td valign='top'> " +
                            " <span class='styleNormalBold'>Fluoride:&nbsp;</span><span class='styleNormal'>" + this.acOfficeTest[0].fluoride + "</span>" +
                            " </td>";
                        no++;
                    }

                    if (this.acOfficeTest[0].spirometry != "") {
                        this.strHTMLPatientOfficeTest += " <td valign='top'> " +
                            " <span class='styleNormalBold'>Lead Screening:&nbsp;</span><span class='styleNormal'>" + this.acOfficeTest[0].lead_screening + "</span>" +
                            " </td>";
                        no++;
                    }

                    if (no > 0 && no % 4 != 0) {
                        while (no % 4 != 0) {
                            this.strHTMLPatientOfficeTest += "<td style='border:none;'></td>";
                            no++;
                        }
                    }

                    this.strHTMLPatientOfficeTest += " </tr> ";

                }//end other						

                this.strHTMLPatientOfficeTest += "</tbody></table>";
                this.strHtmlString += this.strHTMLPatientOfficeTest;
                //strHtmlString+="<br>";
                this.strHtmlString += this.strModuleGap;
            }
        }
        catch (e) {
            this.logMessage.log("OfficeTest Print-HTML" + e);
        }
    }
    Chart_Amendments_Print() {
        try {
            this.strHTMLChartAmendments = "";
            if (this.acAmendments != null && this.acAmendments.length > 0) {
                this.strHTMLChartAmendments = " <table width='98%' class='tableMain'> " +
                    "<tbody >" +
                    "<tr >" +
                    "<th colspan='4'>Amendments</th>" +
                    "</tr>" +
                    "<tr  class='styleModuleSubHeader'>" +
                    "<td width='10'></td>" +
                    "<td width='60'>Date</td>" +
                    "<td>Notes</td>" +
                    "<td>Created User</td>" +
                    "</tr>";
                var i = 0;
                var count = 1;

                for (i = 0; i < this.acAmendments.length; i++) {
                    if (this.acAmendments[i].col2 != null && this.acAmendments[i].col2 != "") {
                        if (i % 2 == 1)
                            this.strHTMLChartAmendments += "<tr style='background-color: #f3f6fb;'>";
                        else
                            this.strHTMLChartAmendments += "<tr>";

                        this.strHTMLChartAmendments += " <td align='left'  valign='top'>" + count + "</td> " +
                            " <td valign='top'>" + this.acAmendments[i].col4 + "</td> " +
                            " <td valign='top'>" + this.generalOperation.ReplaceHTMLReservedWords(this.acAmendments[i].col2) + "</td> " +
                            " <td valign='top'>" + this.acAmendments[i].col3 + "</td>" +
                            " </tr> ";
                        var no = 0;
                        count++;
                    }
                }
                this.strHTMLChartAmendments += " </tbody></table>";
                this.strHtmlString += this.strHTMLChartAmendments;
                this.strHtmlString += this.strModuleGap;
            }
        }
        catch (e) {
            this.logMessage.log("Amendment Print-HTML" + e);
        }
    }
    createHtml() {
        this.ReportHeader();
        debugger;

        this.RFV();
        this.Vital();
        this.Problems();
        this.Surgeries();
        this.Immunization();
        this.SocialHX();
        this.FamilyHX();
        this.Prescription();
        this.Allergies();
        this.ROS();
        this.PhysicalExam();
        this.PlanOfCareNotes();
        this.Annotation();
        this.Cognitive();
        this.CarePlan();
    }

}//class end