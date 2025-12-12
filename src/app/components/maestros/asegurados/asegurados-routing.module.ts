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
            fieldName: 'Nombre', class: 'col-md-6',
            key: 'xnombre',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Apellido', class: 'col-md-6',
            key: 'xapellido',
            bdType: 'text'
          },
          {
            fieldName: 'Identificacion', class: 'col-md-1',
            type: 'simple-select',
            values: [{text: 'Selecciona una opcion...', value: '', selected: true},{text: 'Venezolano', value: 'V'}, {text: 'Extranjero', value: 'E'}, {text: 'Jurídico', value: 'J'}, {text: 'Pasaporte', value: 'P'}], 
            key: 'itipodoc',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Cedula', class: 'col-md-2',
            key: 'xcedula',
            bdType: 'text'
          },
          {
            type: 'date',
            fieldName: 'Fecha Nacimiento', class: 'col-md-3',
            key: 'fnacimiento',
            bdType: 'text'
          },
          {
            type: 'simple-select',
            fieldName: 'Estado Civil', class: 'col-md-2',
            values: [{text: 'Selecciona una opcion...', value: '', selected: true},{text: 'Soltero', value: 'S'}, {text: 'Casado', value: 'C'}, {text: 'Divorciado', value: 'D'}], 
            key: 'iestado_civil',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Teléfono', class: 'col-md-2',
            key: 'xtelefono1',
            bdType: 'text'
          },
          {
            type: 'email',
            fieldName: 'Correo', class: 'col-md-2',
            key: 'xcorreo',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Direccion', class: 'col-md-12',
            key: 'xdireccion',
            bdType: 'text'
          },    
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
            fieldName: 'Nombre', class: 'col-md-6',
            key: 'xnombre',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Apellido', class: 'col-md-6',
            key: 'xapellido',
            bdType: 'text'
          },
          {
            fieldName: 'Identificacion', class: 'col-md-1',
            type: 'simple-select',
            values: [{text: 'Selecciona una opcion...', value: '', selected: true},{text: 'Venezolano', value: 'V'}, {text: 'Extranjero', value: 'E'}, {text: 'Jurídico', value: 'J'}, {text: 'Pasaporte', value: 'P'}], 
            key: 'itipodoc',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Cedula', class: 'col-md-2',
            key: 'xcedula',
            bdType: 'text'
          },
          {
            type: 'date',
            fieldName: 'Fecha Nacimiento', class: 'col-md-3',
            key: 'fnacimiento',
            bdType: 'text'
          },
          {
            type: 'simple-select',
            fieldName: 'Estado Civil', class: 'col-md-2',
            values: [{text: 'Selecciona una opcion...', value: '', selected: true},{text: 'Soltero', value: 'S'}, {text: 'Casado', value: 'C'}, {text: 'Divorciado', value: 'D'}], 
            key: 'iestado_civil',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Teléfono', class: 'col-md-2',
            key: 'xtelefono1',
            bdType: 'text'
          },
          {
            type: 'email',
            fieldName: 'Correo', class: 'col-md-2',
            key: 'xcorreo',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Direccion', class: 'col-md-12',
            key: 'xdireccion',
            bdType: 'text'
          },    
        ]
      } 
    },
    
  ];
  

