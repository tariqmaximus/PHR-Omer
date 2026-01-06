import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { DashboardComponent } from './phr/dashboard/dashboard.component';
import { EncounterSummaryComponent } from './phr/encounter-summary/encounter-summary.component';
import { MessagesComponent } from './phr/messages/messages.component';
import { ActivityLogComponent } from './phr/activity-log/activity-log.component';
import { LoginLogComponent } from './phr/login-log/login-log.component';
import { PatientInfoComponent } from './phr/patient-info/patient-info.component';
import { PhrMessageInboxComponent } from './phr/messages/phr-message-inbox/phr-message-inbox.component';
import { ObgynComponent } from './phr/obgyn/obgyn.component';
import { PhrMessageComposeComponent } from './phr/messages/phr-message-compose/phr-message-compose.component';

import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { LookupListModule } from './providers/lookupList.module';
import { AppConfigModule } from './providers/app-config.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AuthInterceptor } from './authentication/auth-interceptor';
import { QuillModule } from 'ngx-quill';

import { DocumentViewerComponent } from './general-modules/document-viewer/document-viewer.component';

import { EncounterPrintViewerComponent } from './general-modules/encounter-print-viewer/encounter-print-viewer.component';

import { PhrLabSummaryComponent } from './phr/lab/phr-lab-summary/phr-lab-summary.component';
import { PhrLabResultComponent } from './phr/lab/phr-lab-result/phr-lab-result.component';
import { PhrLabResultAttachmentsComponent } from './phr/lab/phr-lab-result-attachments/phr-lab-result-attachments.component';
import { LabResultsComponent } from './phr/lab-results/lab-results.component';

import { DocumentPrintViewerComponent } from './general-modules/document-print-viewer/document-print-viewer.component';

import { ListFilterPipe } from './shared/list-filter-pipe';
import { UniquePipe } from './shared/unique-pipe';
import { PhonePipe } from './shared/phone-pipe';
import { SafePipe } from './shared/docSafe-pipe';
import { LabResultsResultsComponent } from './phr/lab-results/lab-results-results/lab-results-results.component';
import { LabResultsAttachmentsComponent } from './phr/lab-results/lab-results-attachments/lab-results-attachments.component';
import { PhrMainComponent } from './phr-main/phr-main.component';
import { CCDAViewerComponent } from './phr/ccda-viewer/ccda-viewer.component';
import { PhiComponent } from './phr/phi/phi.component';
import { EmailSendingComponent } from './phr/email/email-sending/email-sending.component';
import { DirectEmailSendingComponent } from './phr/email/direct-email/direct-email-send.component';
import { NgbdSortableHeader } from './services/sort-filter-pagination.service';

import { SettingMainComponent } from './phr/setting/setting-main/setting-main.component';
import { AuthorizedAppsComponent } from './phr/setting/authorized-apps/authorized-apps.component';
import { PasswordResetComponent } from './phr/setting/password-reset/password-reset.component';

//import { PrintChartService } from './services/chartprint/printchart.service';
@NgModule({ declarations: [
        AppComponent,
        DashboardComponent,
        EncounterSummaryComponent,
        MessagesComponent,
        ActivityLogComponent,
        LoginLogComponent,
        PatientInfoComponent,
        PhrMessageInboxComponent,
        ObgynComponent,
        LabResultsComponent,
        PhrMessageComposeComponent,
        DocumentViewerComponent,
        EncounterPrintViewerComponent,
        PhrLabSummaryComponent,
        PhrLabResultComponent,
        PhrLabResultAttachmentsComponent,
        DocumentPrintViewerComponent,
        PasswordResetComponent,
        LabResultsResultsComponent,
        LabResultsAttachmentsComponent,
        PhrMainComponent,
        CCDAViewerComponent,
        PhiComponent, EmailSendingComponent, DirectEmailSendingComponent, NgbdSortableHeader, SettingMainComponent, AuthorizedAppsComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [AppComponent], imports: [CommonModule,
        NgbModule,
        LookupListModule,
        AppConfigModule,
        BrowserModule,
        ReactiveFormsModule,
        FormsModule,
        QuillModule.forRoot({
            modules: {
                syntax: false,
                toolbar: [['bold', 'italic', 'underline'],
                    [{ 'size': ['small', true, 'large', 'huge'] }],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'indent': '-1' }, { 'indent': '+1' }],
                    [{ 'font': ['Arial'] }],
                    [{ 'align': [] }],
                    [{ 'color': [] }, { 'background': [] }],
                ]
            }
        }), ListFilterPipe, UniquePipe, PhonePipe, SafePipe],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        }, provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
