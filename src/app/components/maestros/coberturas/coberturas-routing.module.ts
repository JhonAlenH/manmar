import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TableListComponent } from './../../table-list/table-list.component';
import { ItemFormComponent } from './../../item-form/item-form.component';

  export const CoberturasRoutes: Routes = [
    { 
      path: 'coberturas',      component: TableListComponent, data: {
        title: 'Coberturas',
        url: '/api/v1/maestros/coberturas/search',
        tableId: 'coberturas',
        tableInfo: [
          { headerName: 'Codigo', key: 'ccobertura', primary_key: true },
          { headerName: 'Descripcion', key: 'xcobertura' },
          { headerName: 'Ramo', key: 'xramo' },
        ],
        extraInfo: [
          {headerName: 'Informacion', action:'info', icon: 'fa-solid fa-edit', url:'info/'},
          // {headerName: 'Certificado', action:'see_certify', icon: 'fa-solid fa-paperclip', url:'/api/v1/plan/verCertificado/'}
        ]
      }
    },
    { 
      path: 'coberturas/create',   component: ItemFormComponent, data: {
        title: 'Crear Nueva Cobertura',
        mode: 'create',
        mainUrl: '/api/v1/maestros/coberturas/get/',
        createUrl: '/api/v1/maestros/coberturas/create',
        formId: 'create_coberturas',
        fields: [      
          {
            type: 'text',
            fieldName: 'Cobertura', class: 'col-md-6',
            key: 'xcobertura',
            bdType: 'text'
          },
          {
            type: 'simple-select',
            fieldName: 'Ramos',
            class: 'col-md-4',
            url: '/api/v1/maestros/ramos/searchMaestros',
            key: 'cramo',
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
      path: 'coberturas/info/:id',   component: ItemFormComponent, data: {
        title: 'Información de Coberturas',
        mode: 'info',
        mainUrl: '/api/v1/maestros/coberturas/get/',
        editUrl: '/api/v1/maestros/coberturas/edit/',
        formId: 'edit_coberturas',
        disableUrl: '/api/v1/maestros/coberturas/disable/',
        fields: [     

          {
            type: 'text',
            fieldName: 'Cobertura', class: 'col-md-6 text-bold-child',
            key: 'xcobertura',
            bdType: 'text'
          },
          {
            type: 'simple-select',
            fieldName: 'Ramos',
            class: 'col-md-4',
            url: '/api/v1/maestros/ramos/searchMaestros',
            key: 'cramo',
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
  

