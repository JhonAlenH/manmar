import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TableListComponent } from './../../table-list/table-list.component';
import { ItemFormComponent } from './../../item-form/item-form.component';

  export const PlanesRoutes: Routes = [
    { 
      path: 'planes',      component: TableListComponent, data: {
        title: 'Planes',
        url: '/api/v1/maestros/planes/search',
        tableId: 'planes',
        tableInfo: [
          { headerName: 'Plan', key: 'cplan', primary_key: true },
          { headerName: 'Descripción del Plan', key: 'xdescripcion' },
          { headerName: 'Ramo', key: 'xramo' },
        ],
        extraInfo: [
          {headerName: 'Informacion', action:'info', icon: 'fa-solid fa-edit', url:'info/'},
          // {headerName: 'Certificado', action:'see_certify', icon: 'fa-solid fa-paperclip', url:'/api/v1/plan/verCertificado/'}
        ]
      }
    },
    { 
      path: 'planes/create',   component: ItemFormComponent, data: {
        title: 'Crear Nuevo Plan',
        mode: 'create',
        mainUrl: '/api/v1/maestros/planes/get/',
        createUrl: '/api/v1/maestros/planes/create',
        formId: 'create_planes',
        fields: [      
          {
            type: 'text',
            fieldName: 'Descripción del Plan', class: 'col-md-8',
            key: 'xdescripcion',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Ramo', class: 'col-md-2',
            key: 'xramo',
            bdType: 'text'
          },
        ]
      } 
    },
    { 
      path: 'planes/info/:id',   component: ItemFormComponent, data: {
        title: 'Información del Plan',
        mode: 'info',
        mainUrl: '/api/v1/maestros/planes/get/',
        editUrl: '/api/v1/maestros/planes/edit/',
        formId: 'edit_planes',
        disableUrl: '/api/v1/maestros/planes/disable/',
        fields: [     
          {
            type: 'text',
            fieldName: 'Descripción del Plan', class: 'col-md-8',
            key: 'xdescripcion',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Ramo', class: 'col-md-2',
            key: 'xramo',
            bdType: 'text'
          },
        ]
      } 
    },
    
  ];
  

