import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  
  reports: any = [
    {name: 'Reporte de Emisiones', route: '/reports/emissions-report', icon: 'fa-file'},
  ]

  constructor() { }
  
  ngOnInit(): void {
  }


}
