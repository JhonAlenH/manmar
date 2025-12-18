import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TableListComponent } from './../../table-list/table-list.component';
import { ItemFormComponent } from './../../item-form/item-form.component';

  export const BancosRoutes: Routes = [
    { 
      path: 'bancos',      component: TableListComponent, data: {
        title: 'Bancos',
        url: '/api/v1/maestros/bancos/search',
        tableId: 'bancos',
        tableInfo: [
          { headerName: 'ID', key: 'cbanco', primary_key: true },
          { headerName: 'Codigo de Banco', key: 'cod_bancario' },
          { headerName: 'Nombre del Banco', key: 'xbanco' },
          { headerName: 'Moneda', key: 'xmoneda' },
          { headerName: 'País', key: 'xpais' },
        ],
        extraInfo: [
          {headerName: 'Informacion', action:'info', icon: 'fa-solid fa-edit', url:'info/'},
          // {headerName: 'Certificado', action:'see_certify', icon: 'fa-solid fa-paperclip', url:'/api/v1/plan/verCertificado/'}
        ]
      }
    },
    { 
      path: 'bancos/create',   component: ItemFormComponent, data: {
        title: 'Crear Nuevo Banco',
        mode: 'create',
        mainUrl: '/api/v1/maestros/bancos/get/',
        createUrl: '/api/v1/maestros/bancos/create',
        formId: 'create_bancos',
        fields: [      
          {
            type: 'text',
            fieldName: 'Nombre del Banco', class: 'col-md-6',
            required: true,
            key: 'xbanco',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Codigo Bancario', class: 'col-md-2',
            required: false,
            key: 'cod_bancario',
            bdType: 'text'
          },
          { 
            type: 'select',
            fieldName: 'País', class: 'col-md-2',
            required: true,
            url: '/api/v1/maestros/paises',
            key: 'cpais',
            bdType: 'number'
          },
          { 
            type: 'select',
            fieldName: 'Moneda', class: 'col-md-2',
            required: true,
            url: '/api/v1/maestros/monedas',
            key: 'cmoneda',
            bdType: 'number'
          }
        ]
      } 
    },
    { 
      path: 'bancos/info/:id',   component: ItemFormComponent, data: {
        title: 'Información de Monedas',
        mode: 'info',
        mainUrl: '/api/v1/maestros/bancos/get/',
        editUrl: '/api/v1/maestros/bancos/edit/',
        formId: 'edit_bancos',
        disableUrl: '/api/v1/maestros/bancos/disable/',
        fields: [      
          {
            type: 'text',
            fieldName: 'Nombre del Banco', class: 'col-md-6',
            required: true,
            key: 'xbanco',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Codigo Bancario', class: 'col-md-2',
            required: false,
            key: 'cod_bancario',
            bdType: 'text'
          },
          { 
            type: 'select',
            fieldName: 'País', class: 'col-md-2',
            required: true,
            url: '/api/v1/maestros/paises',
            key: 'cpais',
            bdType: 'number'
          },
          { 
            type: 'select',
            fieldName: 'Moneda', class: 'col-md-2',
            required: true,
            url: '/api/v1/maestros/monedas',
            key: 'cmoneda',
            bdType: 'number'
          }
        ]
      } 
    },
    
  ];
  

