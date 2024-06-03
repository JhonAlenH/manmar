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
          { headerName: 'Codigo', key: 'cbanco', primary_key: true },
          { headerName: 'Nombre del Banco', key: 'xbanco' },
          { headerName: 'Nacional o Extranjetro', key: 'itipo' },
          { headerName: 'País', key: 'cpais' },
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
            fieldName: 'Nombre del Banco', class: 'col-md-8',
            key: 'xbanco',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: '(N) Nacional, (E)) Extranjero', class: 'col-md-2',
            key: 'itipo',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'País', class: 'col-md-2',
            key: 'cpais',
            bdType: 'text'
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
            fieldName: 'Nombre del Banco', class: 'col-md-8',
            key: 'xbanco',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: '(N) Nacional, (E)) Extranjero', class: 'col-md-2',
            key: 'itipo',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'País', class: 'col-md-2',
            key: 'cpais',
            bdType: 'text'
          }
        ]
      } 
    },
    
  ];
  

