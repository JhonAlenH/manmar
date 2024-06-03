import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TableListComponent } from './../../table-list/table-list.component';
import { ItemFormComponent } from './../../item-form/item-form.component';

  export const CedentesRoutes: Routes = [
    { 
      path: 'cedentes',      component: TableListComponent, data: {
        title: 'Cedentes',
        url: '/api/v1/maestros/cedentes/search',
        tableId: 'cedentes',
        tableInfo: [
          { headerName: 'Cedente', key: 'ccedente', primary_key: true },
          { headerName: 'Rif', key: 'xrif' },
          { headerName: 'Descripcion', key: 'xcedente' },
          { headerName: 'Teléfono', key: 'xtelefono1' },
          { headerName: 'email', key: 'xcorreo' },
        ],
        extraInfo: [
          {headerName: 'Informacion', action:'info', icon: 'fa-solid fa-edit', url:'info/'},
          // {headerName: 'Certificado', action:'see_certify', icon: 'fa-solid fa-paperclip', url:'/api/v1/plan/verCertificado/'}
        ]
      }
    },
    { 
      path: 'cedentes/create',   component: ItemFormComponent, data: {
        title: 'Crear Nueva Cedente',
        mode: 'create',
        mainUrl: '/api/v1/maestros/cedentes',
        createUrl: '/api/v1/maestros/cedentes/create',
        formId: 'create_cedentes',
        fields: [      
          {
            type: 'text',
            fieldName: 'Descripción Cedente', class: 'col-md-10',
            key: 'xcedente',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Rif.', class: 'col-md-2',
            key: 'xrif',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Ciudad', class: 'col-md-1',
            key: 'cciudad',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Estado', class: 'col-md-1',
            key: 'cestado',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Dirección', class: 'col-md-10',
            key: 'xdireccion',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Teléfono', class: 'col-md-2',
            key: 'xtelefono1',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Teléfono 2', class: 'col-md-2',
            key: 'xtelefono2',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'eMail', class: 'col-md-4',
            key: 'xcorreo',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Portal', class: 'col-md-4',
            key: 'xportal',
            bdType: 'text'
          }, 
          {
            type: 'text',
            fieldName: 'Usuario', class: 'col-md-2',
            key: 'xusuario',
            bdType: 'text'
          }, 
          {
            type: 'text',
            fieldName: 'Login', class: 'col-md-2',
            key: 'xlogin',
            bdType: 'text'
          }        
        ]
      } 
    },
    { 
      path: 'cedentes/info/:id',   component: ItemFormComponent, data: {
        title: 'Información de la Cedente',
        mode: 'info',
        mainUrl: '/api/v1/maestros/cedentes/get/',
        editUrl: '/api/v1/maestros/cedentes/edit/',
        formId: 'edit_cedentes',
        disableUrl: '/api/v1/maestros/cedentes/disable/',
        fields: [     

          {
            type: 'text',
            fieldName: 'Descripción Cedente', class: 'col-md-10',
            key: 'xcedente',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Rif.', class: 'col-md-2',
            key: 'xrif',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Ciudad', class: 'col-md-1',
            key: 'cciudad',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Estado', class: 'col-md-1',
            key: 'cestado',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Dirección', class: 'col-md-10',
            key: 'xdireccion',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Teléfono', class: 'col-md-2',
            key: 'xtelefono1',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Teléfono 2', class: 'col-md-2',
            key: 'xtelefono2',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'eMail', class: 'col-md-4',
            key: 'xcorreo',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Portal Web', class: 'col-md-4',
            key: 'xportal',
            bdType: 'text'
          }, 
          {
            type: 'text',
            fieldName: 'Usuario', class: 'col-md-2',
            key: 'xusuario',
            bdType: 'text'
          }, 
          {
            type: 'text',
            fieldName: 'Login', class: 'col-md-2',
            key: 'xlogin',
            bdType: 'text'
          }
        ]
      } 
    },
    
  ];
  

