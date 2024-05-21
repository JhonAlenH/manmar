import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaestrosComponent } from './maestros.component';
import { MaestrosRoutingModule } from './maestros.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MaterialExampleModule } from 'src/app/material.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MaestrosRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    MatButtonModule,
    MaterialExampleModule
  ]
})
export class MaestrosModule { }
