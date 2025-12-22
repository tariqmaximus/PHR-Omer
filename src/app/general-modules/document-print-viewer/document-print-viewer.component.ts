import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GeneralService } from 'src/app/services/general/general.service';

@Component({
  selector: 'app-document-print-viewer',
  templateUrl: './document-print-viewer.component.html',
  styles: [`
      .styleTopHeader {	font-family: Calibri;	font-weight: bold;	font-size: 18px; color:#0376a8;}
    .styleTopSubHeader {	font-family: Calibri;	font-weight: bold;	font-size: 13px; color:#0376a8;}
    .styleMainHeading {font-family: Calibri; font-weight: bold; font-size: 14px; color:#0376a8;}
    .styleNormal {font-size: 12px; font-family: Calibri;}
    .styleSubHeading {	font-family: Calibri;	font-size: 13px;	font-weight: bold;}
    #customers{font-size:11px;font-family:Trebuchet MS, Arial, Helvetica, sans-serif;border-collapse:collapse;}
    #customers td, #customers th {border:1px solid #0376a8;padding:3px 7px 2px 7px;}
    #customers th {font-size:1.4em;text-align:left;padding-top:5px;padding-bottom:4px;background-color:#0376BB;color:#fff;}
    #el08 {	width:1.2em;	height:1.2em;}
    #customers{font-size:11px;font-family:Trebuchet MS, Arial, Helvetica, sans-serif;border-collapse:collapse;}
    #customers td, #customers th {border:1px solid #0376a8;padding:3px 7px 2px 7px;}
    #customers th {font-size:1.4em;text-align:left;padding-top:5px;padding-bottom:4px;background-color:#0376BB;color:#fff;}
    .styleAbnormal {font-family: Calibri;font-size: 12px;font-weight: bold; color:#C5381C;}
  `],
  encapsulation:ViewEncapsulation.None
})
export class DocumentPrintViewerComponent implements OnInit {
  @Input('section') section: string;
  constructor(public activeModal: NgbActiveModal, private generalService: GeneralService) { }
  print_html;
  print_style;


  ngOnInit() {
  }
  printDiv(html) {

    let printHtml = html;
    this.generalService.printReport(printHtml);
    return;
    if (html && html != undefined && html != '') {
      var printContents = html;
      var originalContents = document.body.innerHTML;

      if (window) {
        if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
          var popup = window.open('', '_blank',
            'width=600,height=600,scrollbars=no,menubar=no,toolbar=no,'
            + 'location=no,status=no,titlebar=no');

          popup.window.focus();
          popup.document.write('<!DOCTYPE html><html><head>  '
            //+'<link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css" '
            //+'media="screen,print">'
            //+'<link rel="stylesheet" href="style.css" media="screen,print">'             
            // +'<style>'
            // +this.print_style
            // +'</style>'
            //+'<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>'+
            //  +'<script type=\'text/javascript\'>'+
            + '$(document).ready(function () { window.print(); })</script><style type="text/css"> @media print {thead {display: table-header-group;} } @page{margin:3mm 3mm 3mm 3mm !important;}table{width:100% !important;}.imctable tr{height: 20px;}</style>'
            + '</head><body onload="self.print()"><div class="reward-body">'
            + printContents + '</div></html>');
          popup.onbeforeunload = function (event) {
            popup.close();
            return '.\n';
          };
          popup.onabort = function (event) {
            popup.document.close();
            popup.close();
          }
        } else {
          var popup = window.open('', '_blank', 'width=800,height=600');
          popup.document.open();
          popup.document.write('<html><head>' +
            +'<link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css"'
            + ' media="all">'
            //+'<link rel="stylesheet" href="style.css" media="all">'                
            + '<style>'
            + this.print_style
            + '</style>'
            + '</head><body onload="window.print()">' + printContents + '</html>');
          popup.document.close();
        }

        popup.document.close();
      }
      return true;
    }
  }
}