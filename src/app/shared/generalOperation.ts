import { Injectable, Inject } from '@angular/core';
import { ListFilterPipe } from './list-filter-pipe';
import { LookupList, LOOKUP_LIST } from '../providers/lookupList.module';
import { ORMPHRAuditLog } from '../models/audit/ORMPHRAuditLog';
import { DateTimeUtil } from './date-time-util';
import { PhrService } from '../services/phr/phr.service';
import { LogMessage } from './log-message';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AlertPopupComponent } from '../general-modules/alert-popup/alert-popup.component';

@Injectable({
    providedIn: 'root'
})
export class GeneralOperation {

    constructor(@Inject(LOOKUP_LIST) public lookupList: LookupList,
        private phrService: PhrService, private logMessage: LogMessage,
        private dateTimeUtil: DateTimeUtil) { }
    //Filter Array 
    filterArray(list: any, col: any, value: any) {
        let lst = new ListFilterPipe().transform(list, col, value);
        return lst;
    }
    ReplaceAll(mainStr: string, find: string, replace: string) {
        let result: string = "";
        if (mainStr != undefined && mainStr != null) {
            result = mainStr.toString().split(find).join(replace);
        }
        return result;
    }
    ReplaceHTMLReservedWords(str: string): string {
        return this.ReplaceAll(this.ReplaceAll(str, "<", "&#60;"), ">", "&#62;");
    }
    //richTextEditorToHtml(str: String) {
    //   return str;
    // }
    //toupdate phr log.
    updateLog(module_Name: String, patient_Id: String, action: String, operation: String) {
        let ormAuditLog: ORMPHRAuditLog = new ORMPHRAuditLog();
        ormAuditLog.log_id = "";
        ormAuditLog.module_name = module_Name;
        ormAuditLog.patient_id = patient_Id;
        ormAuditLog.access = action;
        ormAuditLog.access_date = this.dateTimeUtil.getCurrentDateTimeString();
        ormAuditLog.user_name = this.lookupList.logedInUser.userFullName;
        ormAuditLog.practice_id = this.lookupList.practiceInfo.practiceId.toString();
        ormAuditLog.system_ip = this.lookupList.logedInUser.systemIp;
        ormAuditLog.operation = operation;
        this.phrService.updatePHRLog(ormAuditLog).subscribe(
            data => {

            },
            error => {
                this.logMessage.log("updatePHRLog " + error);
            }
        );

    }
    richTextEditorToHtml(str) {
        // Create XML document
        str = this.ReplaceAll(str, "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Arial\" SIZE=\"14\" COLOR=\"#000000\" LETTERSPACING=\"0\" KERNING=\"0\">", "<br/>");
        str = this.ReplaceAll(str, "</FONT></P></TEXTFORMAT>", "");
        //str =  ("<BODY>"+str+"</BODY>");
        //remove text format
        //str = str.replace(/(<TEXTFORMAT[^>]+>|<TEXTFORMAT>|<\/TEXTFORMAT>)/g, "<br/>");
        //str = str.replace(/(<textformat[^>]+>|<textformat>|<\/textformat>)/g, "<br/>");
        //remove alignleft
        //str = str.replace("align='left'","text-align='left'")
        //remove font tag
        str = str.replace(/(<FONT[^>]+>|<FONT>|<\/FONT>)/g, "");
        str = str.replace(/(<font[^>]+>|<font>|<\/font>)/g, "");
        str = str.replace(/  /g, "&nbsp;");
        return str;
    }
    static poupUpOptions: NgbModalOptions = {
        backdrop: 'static',
        keyboard: false
        // centered: true
    };

    static showAlertPopUp(modalService: NgbModal, message_heading: string, message_Body: string, message_type: string) {
        const modalRef = modalService.open(AlertPopupComponent, this.poupUpOptions);
        modalRef.componentInstance.promptHeading = message_heading
        modalRef.componentInstance.promptMessage = message_Body;
        modalRef.componentInstance.alertType = message_type;
    }
}