import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsRoutingModule } from './reports.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MaterialExampleModule } from 'src/app/material.module';
import { ReportItemComponent } from 'src/app/components/report-item/report-item.component';



@NgModule({
  declarations: [
    ReportItemComponent,
  ],
  imports: [
    CommonModule,
    
    ReportsRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    MatButtonModule,
    MaterialExampleModule
  ]
})
export class ReportsModule { }