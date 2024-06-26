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
          { headerName: 'Nacional o Extranjetro', key: 'xtipo' },
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
            fieldName: 'Nombre del Banco', class: 'col-md-5',
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
            type: 'simple-select',
            fieldName: 'Paises',
            class: 'col-md-3',
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
  

