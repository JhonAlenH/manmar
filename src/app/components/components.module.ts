import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaestrosComponent } from './maestros/maestros.component';
import { TableListComponent } from './table-list/table-list.component';
import { ItemFormComponent } from './item-form/item-form.component';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MaterialExampleModule } from '../material.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    MatButtonModule,
    MatPaginatorModule,
    MaterialExampleModule,
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    MaestrosComponent,
    TableListComponent,
    ItemFormComponent,
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    TableListComponent,
    ItemFormComponent
  ]
})
export class ComponentsModule { }
