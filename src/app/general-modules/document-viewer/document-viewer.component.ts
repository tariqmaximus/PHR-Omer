import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SafePipe } from './../../shared/docSafe-pipe';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeResourceUrl } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import "../../../assets/js/phr.js";
import { ViewEncapsulation } from '@angular/core';
declare var myExtObject: any;
//declare var webGlObject: any;

// @Component({
//   selector: 'document-viewer',
//   templateUrl: './document-viewer.component.html',
  
//   styleUrls: ['./document-viewer.component.css']

// })



@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.component.html',
  styles:[`
  .styleTopHeader {font-family:Trebuchet MS,Arial,Helvetica, sans-serif;font-weight: bold;font-size: 18px; color:#00000;}
  .styleTopSubHeader {font-family:Trebuchet MS, Arial, Helvetica, sans-serif;	font-weight: bold;font-size: 12px; color:#0f4977;}
  .styleMainHeading {font-family:Trebuchet MS, Arial, Helvetica, sans-serif; font-weight: bold; font-size: 13px; color:#0f4977;}
  .styleNormal {font-size: 11px; font-family:Trebuchet MS, Arial, Helvetica, sans-serif;} 
  .styleNormalBold {font-size: 11px; font-family:Trebuchet MS, Arial, Helvetica, sans-serif;font-weight: bold;}
  .styleSubHeading {font-family:Trebuchet MS, Arial, Helvetica, sans-serif;	font-size: 12px;font-weight: bold;}
  .tableMain{font-size:11px;font-font-family:Trebuchet MS, Arial, Helvetica, sans-serif; border-collapse:collapse; border:.1px solid #5bb6d0;}
  .tableMain td {font-family:Trebuchet MS,Arial,Helvetica, sans-serif; border:.1px solid #5bb6d0;padding:3px 7px 2px 7px;}
  .tableMain tr {font-family:Trebuchet MS,Arial,Helvetica, sans-serif; border:.1px solid #5bb6d0; }
  .tableMain th {font-family:Trebuchet MS,Arial,Helvetica, sans-serif; font-size:12px;text-align:left;padding:3px 7px 2px 7px;background-color:#5bb6d0;color:#000000;} 
  .tableNoBorder{font-size:11px;font-family:Trebuchet MS, Arial, Helvetica, sans-serif;border-collapse:collapse;border:0px;}
  .tableNoBorder td {font-family:Trebuchet MS,Arial,Helvetica, sans-serif; border:0px ;padding:3px 5px 2px 5px;valign:top;} 
  .tableNoBorder tr {font-family:Trebuchet MS,Arial,Helvetica, sans-serif; border:0px ; }
  .tableNoBorder th {font-family:Trebuchet MS,Arial,Helvetica, sans-serif; valign:center;  background-color: #edfbf6; color:#000000; font-weight:bold;font-size:12px;border:.1px solid #5bb6d0;padding:3px 5px 2px 5px;}  
  .styleModuleHeader {font-family:Trebuchet MS, Arial, Helvetica, sans-serif;  font-size: 12px;text-align: left; font-weight: bold;  background-color:#5bb6d0;color:#000000;} 
  .styleModuleSubHeader {font-family:Trebuchet MS, Arial, Helvetica, sans-serif; font-size: 11px;   valign:center;  background-color: #d4eeee; color:#000000; font-weight:bold;} 
  .styleAlternateRowColor {font-family:Trebuchet MS,Arial,Helvetica, sans-serif; background-color: #f4fafd;}
  .styleTopSubHeader {font-family:Trebuchet MS,Arial,Helvetica, sans-serif;	font-weight: bold;  font-size: 12px; color:black;}
        .customers{font-family:Trebuchet MS, Arial, Helvetica, sans-serif;border-collapse:collapse;font-size:11px;}
        .customers td, #customers th {border:1px solid #0376a8;padding:3px 7px 2px 7px;}
        .customers th {font-size:1.4em;text-align:left;padding-top:5px;padding-bottom:4px;background-color:#0376BB;color:#fff;}
        .styleNormal {font-size: 11px; font-family:Trebuchet MS, Arial, Helvetica, sans-serif;}  
        .styleAbnormal {font-family: Trebuchet MS, Arial, Helvetica, sans-serif;border-collapse:collapse;font-weight: bold; color:red;} 
        .tableMain{font-family:Trebuchet MS,Arial,Helvetica, sans-serif;font-size:12px;font-family:Calibri;border-collapse:collapse;border:.1px solid #333333;}
        .tableMain td {font-family:Trebuchet MS,Arial,Helvetica, sans-serif;border:.1px solid #333333;padding:3px 5px 2px 5px;}
        .tableMain tr {font-family:Trebuchet MS,Arial,Helvetica, sans-serif;border:.1px solid #333333; }
        .tableMain tr {font-family:Trebuchet MS,Arial,Helvetica, sans-serif;border:.1px solid #333333; }
        .tableNoBorder{font-family:Trebuchet MS,Arial,Helvetica, sans-serif;font-size:12px;font-family:Arial;border-collapse:collapse;border:0px;}
        .tableNoBorder td {font-family:Trebuchet MS,Arial,Helvetica, sans-serif;border:0px ;padding:3px 5px 2px 5px;valign:top;}
        .tableNoBorder tr {font-family:Trebuchet MS,Arial,Helvetica, sans-serif;border:0px ; } 
        .tableNoBorder th {font-family:Trebuchet MS,Arial,Helvetica, sans-serif;valign:center;text-align:left;  background-color: #f4fafd; color:#000000; font-weight:bold;font-size:10px;border:.1px solid #333333;padding:3px 5px 2px 5px;}
        .tabletest{border-collapse: collapse;font-size: 9px; font-family: Verdana;} 
        .tablewrite tr, .tblvitals tr{height:20px;}.tblvitals{border:1px solid black;border-bottom:0;border-collapse: collapse;height:20px;}.tblvitals td{border-left:1px solid black;} 
  `]
})

export class DocumentViewerComponent implements OnInit {
    fileUploadForm : FormGroup; 
       constructor(private domSanitizer : DomSanitizer,public activeModal: NgbActiveModal
       , private formBuilder: FormBuilder) {
       }
       path_doc;
       html_iframe;
       ngOnInit() {
         this.fileUploadForm = this.formBuilder.group({
           RxInput:this.formBuilder.control(null,null)
          });
         //webGlObject.init();
       }
       urlCache = new Map<string, SafeResourceUrl>();
       getLink(): SafeResourceUrl{
         var url = this.urlCache.get(this.path_doc);
         if (!url) {
           url = this.domSanitizer.bypassSecurityTrustResourceUrl(
             this.path_doc);
           this.urlCache.set("41", url);
         }
         return url;
       }
     openPrescriptionResponse(data)
     {
     }
}