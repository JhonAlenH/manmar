import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { ReportItemComponent } from 'src/app/components/report-item/report-item.component';


const routes: Routes =[
  {
    path: 'reports',
    component: ReportsComponent,
  },
  {
    path: 'reports', children: [
      {
        path: 'emissions-report',
        component: ReportItemComponent,
        data: { 
          title: 'Reporte de Emisiones',
          fields: [
            {
              type: 'range-date',
              fieldName: 'Fecha Desde', class: 'col-md-6',
              // required: true,
              key: 'fdesde',
            },
            { 
              type: 'select',
              fieldName: 'Cedente', class: 'col-md-2',
              // required: false,
              url: '/api/v1/maestros/cedentes',
              key: 'ccedente',
            },
            { 
              type: 'select',
              fieldName: 'Ramo', class: 'col-md-2',
              // required: false,
              url: '/api/v1/maestros/ramos',
              key: 'cramo',
              bdType: 'number'
            },
          ],
          urlExport: '/api/v1/reports/emissions/get'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
