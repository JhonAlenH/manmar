import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoberturasRoutes } from './coberturas-routing.module';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(CoberturasRoutes),
    NgbModule,
    ToastrModule.forRoot()
  ]
})
export class CoberturasModule { }
