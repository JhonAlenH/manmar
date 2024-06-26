import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TableListComponent } from './../../table-list/table-list.component';
import { ItemFormComponent } from './../../item-form/item-form.component';

  export const MonedasRoutes: Routes = [
    { 
      path: 'monedas',      component: TableListComponent, data: {
        title: 'Monedas',
        url: '/api/v1/maestros/monedas/search',
        tableId: 'monedas',
        tableInfo: [
          { headerName: 'Codigo', key: 'cmoneda', primary_key: true },
          { headerName: 'Nombre de la Moneda', key: 'xmoneda' },
          { headerName: 'Abreviatura', key: 'xabreviatura' },
        ],
        extraInfo: [
          {headerName: 'Informacion', action:'info', icon: 'fa-solid fa-edit', url:'info/'},
          // {headerName: 'Certificado', action:'see_certify', icon: 'fa-solid fa-paperclip', url:'/api/v1/plan/verCertificado/'}
        ]
      }
    },
    { 
      path: 'monedas/create',   component: ItemFormComponent, data: {
        title: 'Crear Nueva Moneda',
        mode: 'create',
        mainUrl: '/api/v1/maestros/monedas/get/',
        createUrl: '/api/v1/maestros/monedas/create',
        formId: 'create_monedas',
        fields: [      
          {
            type: 'text',
            fieldName: 'Descripción de Moneda', class: 'col-md-6',
            key: 'xmoneda',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Abreviatura', class: 'col-md-4',
            key: 'xabreviatura',
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
      path: 'monedas/info/:id',   component: ItemFormComponent, data: {
        title: 'Información de Monedas',
        mode: 'info',

        mainUrl: '/api/v1/maestros/monedas/get/',
        editUrl: '/api/v1/maestros/monedas/edit/',
        formId: 'edit_monedas',
        disableUrl: '/api/v1/maestros/monedas/disable/',
        fields: [     
          {
            type: 'text',
            fieldName: 'Descripción de Moneda', class: 'col-md-6',
            key: 'xmoneda',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Abreviatura', class: 'col-md-4',
            key: 'xabreviatura',
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
  
