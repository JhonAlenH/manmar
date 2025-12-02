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
            fieldName: 'Activo', class: 'col-md-0',
            defaultValue: 1,
            form_control: true,
            key: 'bactivo',
            bdType: 'number'
          },
          {
            type: 'text',
            fieldName: 'Tomador', class: 'col-md-8',
            key: 'xtomador',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Profesion', class: 'col-md-4',
            key: 'xprofesion',
            bdType: 'text'
          },
          {
            fieldName: 'Identificacion', class: 'col-md-1',
            type: 'simple-select',
            values: [{text: 'Selecciona una opcion...', value: '', selected: true},{text: 'Venezolano', value: 'V'}, {text: 'Extranjero', value: 'E'}, {text: 'Jurídico', value: 'J'}, {text: 'Pasaporte', value: 'P'}], 
            key: 'icedula',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Cedula', class: 'col-md-2',
            key: 'xcedula',
            bdType: 'text'
          },
          { 
            type: 'select',
            fieldName: 'País', class: 'col-md-2',
            values: [{text: 'Selecciona una opcion...', value: '', selected: true},{text: 'Venezuela', value: '58'}], 
            binding_change_fields: ['cestado'],
            change_fields: ['cestado', 'cciudad'],
            key: 'cpais',
            bdType: 'number'
          },
          {
            fieldName: 'Estado', class: 'col-md-2',
            type: 'select',
            key: 'cestado',
            url_id: 'cpais',
            binding_change_fields: ['cciudad'],
            change_fields: ['cciudad'],
            url: '/api/v1/maestros/estados',
            bdType: 'number'
          },
          {
            fieldName: 'Ciudad', class: 'col-md-2',
            type: 'select',
            key: 'cciudad',
            url_id: 'cestado',
            url: '/api/v1/maestros/ciudades',
            bdType: 'number'
          },
          {
            type: 'text',
            fieldName: 'Teléfono', class: 'col-md-2',
            key: 'xtelefono',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Zona Postal', class: 'col-md-1',
            key: 'xzona_postal',
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
            fieldName: 'Direccion', class: 'col-md-10',
            key: 'xdireccion',
            bdType: 'text'
          },    
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
            fieldName: 'Activo', class: 'col-md-0',
            defaultValue: 1,
            form_control: true,
            key: 'bactivo',
            bdType: 'number'
          },
          {
            type: 'text',
            fieldName: 'Tomador', class: 'col-md-8',
            key: 'xtomador',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Profesion', class: 'col-md-4',
            key: 'xprofesion',
            bdType: 'text'
          },
          {
            fieldName: 'Identificacion', class: 'col-md-1',
            type: 'simple-select',
            values: [{text: 'Selecciona una opcion...', value: '', selected: true},{text: 'Venezolano', value: 'V'}, {text: 'Extranjero', value: 'E'}, {text: 'Jurídico', value: 'J'}, {text: 'Pasaporte', value: 'P'}], 
            key: 'icedula',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Cedula', class: 'col-md-2',
            key: 'xcedula',
            bdType: 'text'
          },
          { 
            type: 'select',
            fieldName: 'País', class: 'col-md-2',
            values: [{text: 'Selecciona una opcion...', value: '', selected: true},{text: 'Venezuela', value: '58'}], 
            binding_change_fields: ['cestado'],
            change_fields: ['cestado', 'cciudad'],
            key: 'cpais',
            bdType: 'number'
          },
          {
            fieldName: 'Estado', class: 'col-md-2',
            type: 'select',
            key: 'cestado',
            url_id: 'cpais',
            binding_change_fields: ['cciudad'],
            change_fields: ['cciudad'],
            url: '/api/v1/maestros/estados',
            bdType: 'number'
          },
          {
            fieldName: 'Ciudad', class: 'col-md-2',
            type: 'select',
            key: 'cciudad',
            url_id: 'cestado',
            url: '/api/v1/maestros/ciudades',
            bdType: 'number'
          },
          {
            type: 'text',
            fieldName: 'Teléfono', class: 'col-md-2',
            key: 'xtelefono',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Zona Postal', class: 'col-md-1',
            key: 'xzona_postal',
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
            fieldName: 'Direccion', class: 'col-md-10',
            key: 'xdireccion',
            bdType: 'text'
          },    
        ]
      } 
    },
    
  ];
  



