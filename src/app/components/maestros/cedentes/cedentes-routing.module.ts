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
          { headerName: 'RIF', key: 'cci_rif' },
          { headerName: 'Descripcion', key: 'xcedente' },
          { headerName: 'Teléfono', key: 'xtelefono' },
          { headerName: 'Correo', key: 'xcorreo' },
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
            required: true,
            key: 'xcedente',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Codigo Superintendencia', class: 'col-md-2',
            required: true,
            key: 'csuper',
            bdType: 'text'
          },
          {
            type: 'simple-select',
            fieldName: 'Identificacion', class: 'col-md-1',
            required: true,
            values: [{text: 'Selecciona una opcion...', value: '', selected: true},{text: 'Jurídico', value: 'J'}], 
            key: 'itipodoc',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'RIF.', class: 'col-md-2',
            required: true,
            key: 'cci_rif',
            bdType: 'text'
          },
          { 
            type: 'select',
            fieldName: 'País', class: 'col-md-2',
            required: false,
            url: '/api/v1/maestros/paises',
            binding_change_fields: ['cestado'],
            change_fields: ['cestado', 'cciudad'],
            key: 'cpais',
            bdType: 'number'
          },
          {
            type: 'select',
            fieldName: 'Estado', class: 'col-md-2',
            required: false,
            key: 'cestado',
            url_id: 'cpais',
            binding_change_fields: ['cciudad'],
            change_fields: ['cciudad'],
            url: '/api/v1/maestros/estados',
            bdType: 'number'
          },
          {
            type: 'select',
            fieldName: 'Ciudad', class: 'col-md-2',
            required: false,
            key: 'cciudad',
            url_id: 'cestado',
            url: '/api/v1/maestros/ciudades',
            bdType: 'number'
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
            key: 'xtelefono',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Correo', class: 'col-md-4',
            key: 'xcorreo',
            bdType: 'text'
          },       
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
            required: true,
            key: 'xcedente',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Codigo Superintendencia', class: 'col-md-2',
            required: true,
            key: 'csuper',
            bdType: 'text'
          },
          {
            type: 'simple-select',
            fieldName: 'Identificacion', class: 'col-md-1',
            required: true,
            values: [{text: 'Selecciona una opcion...', value: '', selected: true},{text: 'Jurídico', value: 'J'}], 
            key: 'itipodoc',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'RIF.', class: 'col-md-2',
            required: true,
            key: 'cci_rif',
            bdType: 'text'
          },
          { 
            type: 'select',
            fieldName: 'País', class: 'col-md-2',
            required: false,
            url: '/api/v1/maestros/paises',
            binding_change_fields: ['cestado'],
            change_fields: ['cestado', 'cciudad'],
            key: 'cpais',
            bdType: 'number'
          },
          {
            type: 'select',
            fieldName: 'Estado', class: 'col-md-2',
            required: false,
            key: 'cestado',
            url_id: 'cpais',
            binding_change_fields: ['cciudad'],
            change_fields: ['cciudad'],
            url: '/api/v1/maestros/estados',
            bdType: 'number'
          },
          {
            type: 'select',
            fieldName: 'Ciudad', class: 'col-md-2',
            required: false,
            key: 'cciudad',
            url_id: 'cestado',
            url: '/api/v1/maestros/ciudades',
            bdType: 'number'
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
            key: 'xtelefono',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Correo', class: 'col-md-4',
            key: 'xcorreo',
            bdType: 'text'
          },       
        ]
      } 
    },
    
  ];
  

