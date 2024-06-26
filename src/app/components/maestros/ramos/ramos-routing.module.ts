import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TableListComponent } from './../../table-list/table-list.component';
import { ItemFormComponent } from './../../item-form/item-form.component';

  export const RamosRoutes: Routes = [
    { 
      path: 'ramos',      component: TableListComponent, data: {
        title: 'Ramos',
        url: '/api/v1/maestros/ramos/search',
        tableId: 'ramos',
        tableInfo: [
          { headerName: 'Ramo', key: 'cramo', primary_key: true },
          { headerName: 'Descripción', key: 'xramo' },
        ],
        extraInfo: [
          {headerName: 'Informacion', action:'info', icon: 'fa-solid fa-edit', url:'info/'},
          // {headerName: 'Certificado', action:'see_certify', icon: 'fa-solid fa-paperclip', url:'/api/v1/plan/verCertificado/'}
        ]
      }
    },
    { 
      path: 'ramos/create',   component: ItemFormComponent, data: {
        title: 'Crear Nuevo Ramo',
        mode: 'create',
        mainUrl: '/api/v1/maestros/ramos/get/',
        createUrl: '/api/v1/maestros/ramos/create',
        formId: 'create_ramos',
        fields: [      
          {
            type: 'text',
            fieldName: 'Descripción del Ramo', class: 'col-md-10',
            key: 'xramo',
            bdType: 'text'
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
      path: 'ramos/info/:id',   component: ItemFormComponent, data: {
        title: 'Información de Ramo',
        mode: 'info',
        mainUrl: '/api/v1/maestros/ramos/get/',
        editUrl: '/api/v1/maestros/ramos/edit/',
        formId: 'edit_ramos',
        disableUrl: '/api/v1/maestros/ramos/disable/',
        fields: [     
          {
            type: 'text',
            fieldName: 'Descripción del Ramo', class: 'col-md-10',
            key: 'xramo',
            bdType: 'text'
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
  

