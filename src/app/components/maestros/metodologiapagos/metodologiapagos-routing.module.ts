import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TableListComponent } from './../../table-list/table-list.component';
import { ItemFormComponent } from './../../item-form/item-form.component';

  export const MetodologiapagoRoutes: Routes = [
    { 
      path: 'metodologiapago',      component: TableListComponent, data: {
        title: 'Metodologia de Pago',    
        url: '/api/v1/maestros/metodologiapago/search',
        editUrl: '/api/v1/maestros/metodologiapago/edit/',
        tableId: 'metodologiapago',
        tableInfo: [
          { headerName: 'Codigo', key: 'cmetodologiapago', primary_key: true },
          { headerName: 'Descripción', key: 'xmetodologiapago' },
          { headerName: 'Cuotas', key: 'ncuotas' }
        ],
        extraInfo: [
          {headerName: 'Informacion', action:'info', icon: 'fa-solid fa-edit', url:'info/'},
          // {headerName: 'Certificado', action:'see_certify', icon: 'fa-solid fa-paperclip', url:'/api/v1/plan/verCertificado/'}
        ]
      }
    },
    { 
      path: 'metodologiapago/create',   component: ItemFormComponent, data: {
        title: 'Crear Metodologia de Pago',
        mode: 'create',
        mainUrl: '/api/v1/maestros/metodologiapago/get/',
        createUrl: '/api/v1/maestros/metodologiapago/create',
        formId: 'create_metodologiapago',
        fields: [ 
          {
            key: 'xmetodologiapago',
            fieldName: 'Nombre de Metodología', class: 'col-md-8',
            required:true,
            type: 'text',
            bdType: 'text'
          },        
          {
            key: 'ndias',
            fieldName: 'Nº Días', class: 'col-md-2',
            type: 'number',
            bdType: 'text'
          },
          {
            key: 'ncuotas',
            fieldName: 'Nº Cuotas', class: 'col-md-2',
            type: 'number',
            bdType: 'text'
          }
        ]
      } 
    },
    { 
      path: 'metodologiapago/info/:id',   component: ItemFormComponent, data: {
        title: 'Información de Metodologia de Pago',
        mode: 'info',
        mainUrl: '/api/v1/maestros/metodologiapago/get/',
        editUrl: '/api/v1/maestros/metodologiapago/edit/',
        formId: 'edit_metodologiapago',
        disableUrl: '/api/v1/maestros/metodologiapago/disable/',
        fields: [ 
          {
            key: 'xmetodologiapago',
            fieldName: 'Nombre de Metodología', class: 'col-md-8',
            required:true,
            type: 'text',
            bdType: 'text'
          },        
          {
            key: 'ndias',
            fieldName: 'Nº Días', class: 'col-md-2',
            type: 'number',
            bdType: 'text'
          },
          {
            key: 'ncuotas',
            fieldName: 'Nº Cuotas', class: 'col-md-2',
            type: 'number',
            bdType: 'text'
          }
        ]
      } 
    },
    
  ];
  
