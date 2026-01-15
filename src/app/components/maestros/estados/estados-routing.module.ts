import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TableListComponent } from './../../table-list/table-list.component';
 import { ItemFormComponent } from './../../item-form/item-form.component';

  export const EstadosRoutes: Routes = [
    { 
      path: 'estados',      component: TableListComponent, data: {
        title: 'Estados',
        url: '/api/v1/maestros/estados/search',
        editUrl: '/api/v1/maestros/estados/edit/',
        tableId: 'estados',
        tableInfo: [
          { headerName: 'Codigo Estado', key: 'cestado', primary_key: true },
          { headerName: 'Descripción del Estado', key: 'xestado' },
          { headerName: 'País', key: 'xpais'},
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
        mainUrl: '/api/v1/maestros/maestros/estados/',
        createUrl: '/api/v1/maestros/estados/create',
        formId: 'create_estados',
        fields: [
          { 
            type: 'select',
            fieldName: 'País', class: 'col-md-2',
            required: true,
            url: '/api/v1/maestros/paises',
            key: 'cpais',
            bdType: 'number'
          },
          {
            type: 'text',
            fieldName: 'Nombre del Estado', class: 'col-md-10',
            required: true,
            key: 'xestado',
            bdType: 'text'
          },
          
        ]
      } 
    },
    { 
      path: 'estados/info/:id',   component: ItemFormComponent, data: {
        title: 'Información del Estado',
        mode: 'info',
        mainUrl: '/api/v1/maestros/estados/get/',
        editUrl: '/api/v1/maestros/estados/edit/',
        formId: 'edit_estados',
        // disableUrl: '/api/v1/maestros/estados/disable/',
        fields: [
          { 
            type: 'select',
            fieldName: 'País', class: 'col-md-2',
            required: true,
            url: '/api/v1/maestros/paises',
            key: 'cpais',
            bdType: 'number'
          },
          {
            type: 'text',
            fieldName: 'Nombre del Estado', class: 'col-md-10',
            required: true,
            key: 'xestado',
            bdType: 'text'
          },
          
        ]
      } 
    },
    
  ];
  