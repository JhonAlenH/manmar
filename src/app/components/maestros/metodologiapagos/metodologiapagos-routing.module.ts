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
        tableId: 'metodologiapago',
        tableInfo: [
          { headerName: 'Codigo', key: 'cmetodologiapago', primary_key: true },
          { headerName: 'Descripción', key: 'xmetodologiapago' },
          { headerName: 'País', key: 'xpais' }
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
            fieldName: 'Descripción', class: 'col-md-8',
            type: 'text',
            key: 'xmetodologiapago',
            bdType: 'text'
          },        
          {
            type: 'simple-select',
            fieldName: 'Paises',
            class: 'col-md-4',
            url: '/api/v1/maestros/paises/searchMaestros',
            key: 'cpais',
            bdType: 'number'
          },
          {
            type: 'simple-select',
            fieldName: 'Estatus del Registro',
            class: 'col-md-2',
            values: [{text: 'Activo', value: '1'}, {text: 'Inactivo', value: '0'}],
            key: 'bactivo',
            bdType: 'number'
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
            fieldName: 'Descripción', class: 'col-md-8',
            type: 'text',
            key: 'xmetodologiapago',
            bdType: 'text'
          },        
          {
            type: 'simple-select',
            fieldName: 'Paises',
            class: 'col-md-4',
            url: '/api/v1/maestros/paises/searchMaestros',
            key: 'cpais',
            bdType: 'number'
          },
          {
            type: 'simple-select',
            fieldName: 'Estatus del Registro',
            class: 'col-md-2',
            values: [{text: 'Activo', value: '1'}, {text: 'Inactivo', value: '0'}],
            key: 'bactivo',
            bdType: 'number'
          }
        ]
      } 
    },
    
  ];
  
