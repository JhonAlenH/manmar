import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientesRoutes } from './clientes-routing.module';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(ClientesRoutes),
    NgbModule,
    ToastrModule.forRoot()
  ]
})
export class ClientesModule { }
