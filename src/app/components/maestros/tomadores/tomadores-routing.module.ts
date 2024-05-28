import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TableListComponent } from './../../table-list/table-list.component';
import { ItemFormComponent } from './../../item-form/item-form.component';

  export const TomadoresRoutes: Routes = [
    { 
      path: 'tomadores',      component: TableListComponent, data: {
        title: 'tomadores',
        url: '/api/v1/maestros/tomadores/search',
        tableId: 'tomadores',
        tableInfo: [
          { headerName: 'Tomador', key: 'ctomador', primary_key: true },
          { headerName: 'Nombre Tomador', key: 'xtomador', primary_key: true },
          { headerName: 'Cédula', key: 'xcedula' }, 
          { headerName: 'Teléfono', key: 'xtelefono'},          
        ],
        extraInfo: [
          {headerName: 'Informacion', action:'info', icon: 'fa-solid fa-edit', url:'info/'},
          // {headerName: 'Certificado', action:'see_certify', icon: 'fa-solid fa-paperclip', url:'/api/v1/plan/verCertificado/'}
        ]
      }
    },
    { 
      path: 'tomadores/create',   component: ItemFormComponent, data: {
        title: 'Crear Nuevo Tomador',
        mode: 'create',
        mainUrl: '/api/v1/maestros/tomadores/get/',
        createUrl: '/api/v1/maestros/tomadores/create', 
        formId: 'create_tomadores',
        fields: [   

          {
            type: 'text',
            fieldName: 'Cédula Tomador', class: 'col-md-2',
            key: 'xcedula',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Nombre Tomador', class: 'col-md-8',
            key: 'xtomador',
            bdType: 'text'
          },

          {
            type: 'text',
            fieldName: 'Teléfono', class: 'col-md-2',
            key: 'xtelefono',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Dirección', class: 'col-md-12',
            key: 'xdireccion',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'EMail', class: 'col-md-4',
            key: 'xcorreo',
            bdType: 'text'
          }     
        ]
      } 
    },
    { 

      path: 'tomadores/info/:id',   component: ItemFormComponent, data: {
        title: 'Información del Tomador',
        mode: 'info',
        mainUrl: '/api/v1/maestros/tomadores/get/',
        createUrl: '/api/v1/maestros/tomadores/create/',
        editUrl: '/api/v1/maestros/tomadores/edit/',
        formId: 'edit_tomadores',
        disableUrl: '/api/v1/maestros/tomadores/disable/',
        fields: [    

          {
            type: 'text',
            fieldName: 'Cédula Tomador', class: 'col-md-2',
            key: 'xcedula',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Nombre Tomador', class: 'col-md-8',
            key: 'xtomador',
            bdType: 'text'
          },

          {
            type: 'text',
            fieldName: 'Teléfono', class: 'col-md-2',
            key: 'xtelefono',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Dirección', class: 'col-md-12',
            key: 'xdireccion',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'EMail', class: 'col-md-4',
            key: 'xcorreo',
            bdType: 'text'
          }
        ]
      } 
    },
    
  ];
  



