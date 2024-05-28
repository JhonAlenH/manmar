import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TableListComponent } from './../../table-list/table-list.component';
import { ItemFormComponent } from './../../item-form/item-form.component';

  export const PaisesRoutes: Routes = [
    { 
      path: 'paises',      component: TableListComponent, data: {
        title: 'Paises',
        url: '/api/v1/maestros/paises/search',
        tableId: 'paises',
        tableInfo: [
          { headerName: 'Codigo', key: 'cpais', primary_key: true },
          { headerName: 'Nombre del País', key: 'xpais' },
        ],
        extraInfo: [
          {headerName: 'Informacion', action:'info', icon: 'fa-solid fa-edit', url:'info/'},
          // {headerName: 'Certificado', action:'see_certify', icon: 'fa-solid fa-paperclip', url:'/api/v1/plan/verCertificado/'}
        ]
      }
    },
    { 
      path: 'paises/create',   component: ItemFormComponent, data: {
        title: 'Crear Nuevo Pais',
        mode: 'create',
        mainUrl: '/api/v1/maestros/paises',
        createUrl: '/api/v1/maestros/paises/create',
        formId: 'create_pais',
        fields: [      
          {
            fieldName: 'Nombre del País', class: 'col-md-6',
            type: 'text',
            key: 'xpais',
            bdType: 'text'
          }
        ]
      } 
    },
    { 
      path: 'paises/info/:id',   component: ItemFormComponent, data: {
        title: 'Información del País',
        mode: 'info',
        mainUrl: '/api/v1/maestros/paises/get/',
        editUrl: '/api/v1/maestros/paises/edit/',
        formId: 'edit_paises',
        disableUrl: '/api/v1/paises/disable/',
        fields: [     
          {
            fieldName: 'Nombre del País', class: 'col-md-6',
            type: 'text',
            key: 'xpais',
            bdType: 'text'
          }
        ]
      } 
    },
    
  ];
  