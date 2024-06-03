import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TableListComponent } from './../../table-list/table-list.component';
import { ItemFormComponent } from './../../item-form/item-form.component';

  export const AseguradosRoutes: Routes = [
    { 
      path: 'asegurados',      component: TableListComponent, data: {
        title: 'Asegurados',
        url: '/api/v1/maestros/asegurados/search',
        tableId: 'asegurados',
        tableInfo: [
          { headerName: 'Asegurado', key: 'casegurado', primary_key: true },
          { headerName: 'Cédula', key: 'xcedula' },
          { headerName: 'Nombre', key: 'xnombre' },
          { headerName: 'Apellido', key: 'xapellido' },
          { headerName: 'Teléfono', key: 'xtelefono1' },
        ],
        extraInfo: [
          {headerName: 'Informacion', action:'info', icon: 'fa-solid fa-edit', url:'info/'},
          // {headerName: 'Certificado', action:'see_certify', icon: 'fa-solid fa-paperclip', url:'/api/v1/plan/verCertificado/'}
        ]
      }
    },
    { 
      path: 'asegurados/create',   component: ItemFormComponent, data: {
        title: 'Crear Nuevo Asegurado',
        mode: 'create',
        mainUrl: '/api/v1/maestros/asegurados/get/',
        createUrl: '/api/v1/maestros/asegurados/create', 
        formId: 'create_asegurados',
        fields: [      
          {
            type: 'text',
            fieldName: 'Nombre Asegurado', class: 'col-md-6',
            key: 'xnombre',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Apellido Asegurado', class: 'col-md-6',
            key: 'xapellido',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Cedula', class: 'col-md-2',
            key: 'xcedula',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Fecha Nacimiento', class: 'col-md-3',
            key: 'fnacimiento',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Estado Civil', class: 'col-md-1',
            key: 'iestado_civil',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Teléfono 1', class: 'col-md-3',
            key: 'xtelefono1',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Teléfono 2', class: 'col-md-3',
            key: 'xtelefono2',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Direccion', class: 'col-md-12',
            key: 'xdireccion',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'eMail', class: 'col-md-6',
            key: 'xcorreo',
            bdType: 'text'
          }     
        ]
      } 
    },
    { 
      path: 'asegurados/info/:id',   component: ItemFormComponent, data: {
        title: 'Información de la Cedente',
        mode: 'info',
        mainUrl: '/api/v1/maestros/asegurados/get/',
        editUrl: '/api/v1/maestros/asegurados/edit/',
        formId: 'edit_asegurados',
        disableUrl: '/api/v1/maestros/asegurados/disable/',
        fields: [     

          {
            type: 'text',
            fieldName: 'Nombre Asegurado', class: 'col-md-6',
            key: 'xnombre',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Apellido Asegurado', class: 'col-md-6',
            key: 'xapellido',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Cedula', class: 'col-md-2',
            key: 'xcedula',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Fecha Nacimiento', class: 'col-md-3',
            key: 'fnacimiento',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Estado Civil', class: 'col-md-1',
            key: 'iestado_civil',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Teléfono 1', class: 'col-md-3',
            key: 'xtelefono1',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Teléfono 2', class: 'col-md-3',
            key: 'xtelefono2',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Direccion', class: 'col-md-12',
            key: 'xdireccion',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'eMail', class: 'col-md-6',
            key: 'xcorreo',
            bdType: 'text'
          }
        ]
      } 
    },
    
  ];
  

