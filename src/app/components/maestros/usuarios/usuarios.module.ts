import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutes } from './usuarios-routing.module';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(UsuariosRoutes),
    NgbModule,
    ToastrModule.forRoot()
  ]
})
export class UsuariosModule { }
