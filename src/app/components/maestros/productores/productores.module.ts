import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductoresRoutes } from './productores-routing.module';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(ProductoresRoutes),
    NgbModule,
    ToastrModule.forRoot()
  ]
})
export class ProductoresModule { }
