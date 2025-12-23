import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-lab-results',
    templateUrl: './lab-results.component.html',
    styleUrls: ['./lab-results.component.css'],
    standalone: false
})
export class LabResultsComponent implements OnInit {
  labResults = true;
  selectedTab="lab-result";
  
  constructor() { }

  ngOnInit() {
  }

}
