import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TableListComponent } from './../../table-list/table-list.component';
 import { ItemFormComponent } from './../../item-form/item-form.component';

  export const EstadosRoutes: Routes = [
    { 
      path: 'estados',      component: TableListComponent, data: {
        title: 'Estados',
        url: '/api/v1/estados/search',
        tableId: 'estados',
        tableInfo: [
          { headerName: 'Codigo País', key: 'cpais', primary_key: true},
          { headerName: 'Codigo Estado', key: 'cestado', primary_key: true },
          { headerName: 'Descripción del Estado', key: 'xestado' },
        ],
        extraInfo: [
          {headerName: 'Informacion', action:'info', icon: 'fa-solid fa-edit', url:'info/'},
          // {headerName: 'Certificado', action:'see_certify', icon: 'fa-solid fa-paperclip', url:'/api/v1/plan/verCertificado/'}
        ]
      }
    },
    { 
      path: 'estados/create',   component: ItemFormComponent, data: {
        title: 'Crear Nuevo Estado',
        mode: 'create',
        mainUrl: '/api/v1/maestros/estados/',
        createUrl: '/api/v1/estados/create',
        formId: 'create_estados',
        fields: [      
          {
            fieldName: 'Descripción del Estado', class: 'col-md-6',
            type: 'text',
            key: 'xestado',
            bdType: 'text'
          }
        ]
      } 
    },
    { 
      path: 'estados/info/:id',   component: ItemFormComponent, data: {
        title: 'Información del Estado',
        mode: 'info',
        mainUrl: '/api/v1/estados/get/',
        editUrl: '/api/v1/estados/edit/',
        formId: 'edit_estados',
        disableUrl: '/api/v1/estados/disable/',
        fields: [     
          {
            fieldName: 'Descripción del Estado', class: 'col-md-6',
            type: 'text',
            key: 'xestado',
            bdType: 'text'
          }
        ]
      } 
    },
    
  ];
  