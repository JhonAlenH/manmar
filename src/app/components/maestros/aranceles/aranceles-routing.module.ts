import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TableListComponent } from './../../table-list/table-list.component';
import { ItemFormComponent } from './../../item-form/item-form.component';

  export const ArancelesRoutes: Routes = [
    { 
      path: 'aranceles',      component: TableListComponent, data: {
        title: 'Aranceles',
        url: '/api/v1/maestros/aranceles/search',
        tableId: 'bancos',
        tableInfo: [
          { headerName: 'Codigo', key: 'carancel', primary_key: true },
          { headerName: 'Cedente', key: 'xcedente' },
          { headerName: 'Ramo', key: 'xramo' },
          { headerName: '% Comisión', key: 'pcomision' },
        ],
        extraInfo: [
          {headerName: 'Informacion', action:'info', icon: 'fa-solid fa-edit', url:'info/'},
          // {headerName: 'Certificado', action:'see_certify', icon: 'fa-solid fa-paperclip', url:'/api/v1/plan/verCertificado/'}
        ]
      }
    },
    { 
      path: 'aranceles/create',   component: ItemFormComponent, data: {
        title: 'Crear Nuevo Arancel',
        mode: 'create',
        mainUrl: '/api/v1/maestros/aranceles/get/',
        createUrl: '/api/v1/maestros/aranceles/create',
        formId: 'create_aranceles',
        fields: [      
          {
            type: 'simple-select',
            fieldName: 'Cedentes',
            class: 'col-md-4',
            url: '/api/v1/maestros/cedentes/searchMaestros',
            key: 'ccedente',
            bdType: 'number'
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
            type: 'text',
            fieldName: '% Comisión', class: 'col-md-2',
            key: 'pcomision',
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
      path: 'aranceles/info/:id',   component: ItemFormComponent, data: {
        title: 'Información de Aranceles',
        mode: 'info',
        mainUrl: '/api/v1/maestros/aranceles/get/',
        editUrl: '/api/v1/maestros/aranceles/edit/',
        formId: 'edit_aranceles',
        disableUrl: '/api/v1/maestros/aranceles/disable/',
        fields: [     
          {
            type: 'simple-select',
            fieldName: 'Cedentes',
            class: 'col-md-4',
            url: '/api/v1/maestros/cedentes/searchMaestros',
            key: 'ccedente',
            bdType: 'number'
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
            type: 'text',
            fieldName: '% Comisión', class: 'col-md-2',
            key: 'pcomision',
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
  

