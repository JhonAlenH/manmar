import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CiudadesRoutes } from './ciudades-routing.module';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(CiudadesRoutes),
    NgbModule,
    ToastrModule.forRoot()
  ]
})
export class ClientesModule { }

