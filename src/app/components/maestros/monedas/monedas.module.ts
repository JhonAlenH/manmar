import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonedasRoutes } from './monedas-routing.module';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(MonedasRoutes),
    NgbModule,
    ToastrModule.forRoot()
  ]
})
export class MonedasModule { }
