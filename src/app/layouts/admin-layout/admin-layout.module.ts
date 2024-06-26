import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialExampleModule } from './../../material.module'
import { ClipboardModule } from 'ngx-clipboard';

import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { EmissionsComponent } from '../../pages/emissions/emissions.component';
import { SearchContractsComponent } from '../../pages/emissions/search-contracts/search-contracts.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ContainerAutomobileComponent } from '../../_containers/container-automobile/container-automobile.component';
// import { ToastrModule } from 'ngx-toastr';
import { PresupuestoComponent } from '../../pages/presupuesto/presupuesto.component';
import { PresupuestoMantComponent } from 'src/app/pages/presupuesto/presupuesto-mant/presupuesto-mant.component';
import { PresupuestoCreateComponent } from 'src/app/pages/presupuesto/presupuesto-create/presupuesto-create.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialExampleModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule,
    ReactiveFormsModule,
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TablesComponent,
    IconsComponent,
    MapsComponent,
    EmissionsComponent,
    ContainerAutomobileComponent,
    PresupuestoComponent,
    PresupuestoMantComponent,
    PresupuestoCreateComponent,
    SearchContractsComponent,
    ContainerAutomobileComponent
  ]
})

export class AdminLayoutModule {}
