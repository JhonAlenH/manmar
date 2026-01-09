import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TableListComponent } from './../../table-list/table-list.component';
import { ItemFormComponent } from './../../item-form/item-form.component';

  export const ProductoresRoutes: Routes = [
    { 
      path: 'productores',      component: TableListComponent, data: {
        title: 'Productores',
        url: '/api/v1/maestros/productores/search',
        tableId: 'productores',
        tableInfo: [
          { headerName: 'Productor', key: 'cproductor', primary_key: true },
          { headerName: 'Nombre Productor', key: 'xproductor' },
          { headerName: 'Tipo de Productor', key: 'xtipo' },
          { headerName: 'Cédula/Rif', key: 'cci_rif' },          
        ],
        extraInfo: [
          {headerName: 'Informacion', action:'info', icon: 'fa-solid fa-edit', url:'info/'},
          // {headerName: 'Certificado', action:'see_certify', icon: 'fa-solid fa-paperclip', url:'/api/v1/plan/verCertificado/'}
        ]
      }
    },
    { 
      path: 'productores/create',   component: ItemFormComponent, data: {
        title: 'Crear Nuevo Productor',
        mode: 'create',
        mainUrl: '/api/v1/maestros/productores/get/',
        createUrl: '/api/v1/maestros/productores/create', 
        formId: 'create_productores',
        fields: [
          {
            type: 'text',
            fieldName: 'Nombre del Productor', class: 'col-md-8',
            required: true,
            key: 'xproductor',
            bdType: 'text'
          },
          {
            type: 'text',
            required: false,
            fieldName: 'Codigo Super.', class: 'col-md-2',
            key: 'csuper',
            bdType: 'text'
          },
          { 
            type: 'select',
            fieldName: 'Tipo Productor', class: 'col-md-2',
            required: true,
            url: '/api/v1/maestros/tipo_produc',
            key: 'ctipo_productor',
            bdType: 'number'
          },
          {
            type: 'simple-select',
            fieldName: 'Identificacion', class: 'col-md-1',
            required: true,
            values: [{text: 'Selecciona una opcion...', value: '', selected: true},{text: 'Venezolano', value: 'V'}, {text: 'Extranjero', value: 'E'}, {text: 'Jurídico', value: 'J'}, {text: 'Pasaporte', value: 'P'}], 
            key: 'itipodoc',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Cédula', class: 'col-md-3',
            required: true,
            key: 'cci_rif',
            bdType: 'text'
          },
          { 
            type: 'select',
            fieldName: 'País', class: 'col-md-2',
            required: true,
            url: '/api/v1/maestros/paises',
            binding_change_fields: ['cestado'],
            change_fields: ['cestado', 'cciudad'],
            key: 'cpais',
            bdType: 'number'
          },
          {
            type: 'select',
            fieldName: 'Estado', class: 'col-md-2',
            required: true,
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
            required: true,
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
            fieldName: 'Dirección', class: 'col-md-6',
            key: 'xdireccion',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Correo', class: 'col-md-4',
            key: 'xcorreo',
            bdType: 'text'
          },
          {
            type: 'hidden',
            fieldName: 'Datos Bancarios', class: 'col-md-12 my-4 text',
            key: 'datos_bancarios',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Nº de Cuenta', class: 'col-md-4',
            required: true,
            key: 'xcuenta',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'RIF Bancario', class: 'col-md-2',
            required: true,
            key: 'cci_rif_banco',
            bdType: 'text'
          },
          {
            type: 'select',
            fieldName: 'Moneda', class: 'col-md-2',
            required: true,
            url: '/api/v1/maestros/monedas',
            binding_change_fields: ['cbanco'],
            change_fields: ['cbanco'],
            key: 'cmoneda',
            bdType: 'number'
          },
          {
            type: 'select',
            fieldName: 'Banco', class: 'col-md-4',
            required: true,
            url: '/api/v1/maestros/bancos',
            url_id: 'cmoneda',
            key: 'cbanco',
            bdType: 'number'
          },
          {
            type: 'text',
            fieldName: 'Teléfono', class: 'col-md-4',
            key: 'xtelefono_banco',
            bdType: 'text'
          },
          {
            type: 'simple-select',
            fieldName: 'Tipo de Cuenta', class: 'col-md-4',
            required: true,
            values: [{text: 'Selecciona una opcion...', value: '', selected: true},{text: 'Corriente', value: 'C'}, {text: 'Ahorro', value: 'A'}, {text: 'Otra', value: 'O'}], 
            key: 'itipo_cuenta',
            bdType: 'text'
          },
          {
            type: 'hidden',
            fieldName: 'Datos de Usuario', class: 'col-md-12 my-4 text',
            key: 'datos_usuario',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Usuario', class: 'col-md-2',
            required: true,
            key: 'xusuario',
            bdType: 'text'
          },
          {
            type: 'password',
            fieldName: 'Contraseña', class: 'col-md-2',
            required: true,
            key: 'xcontrasena',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Observacion', class: 'col-md-8',
            key: 'xobservacion',
            bdType: 'text'
          },
        ]
      } 
    },
    { 
      path: 'productores/info/:id',   component: ItemFormComponent, data: {
        title: 'Información del Productor',
        mode: 'info',
        mainUrl: '/api/v1/maestros/productores/get/',
        createUrl: '/api/v1/maestros/productores/create/',
        editUrl: '/api/v1/maestros/productores/edit/',
        formId: 'edit_ejecutivos',
        disableUrl: '/api/v1/maestros/productores/disable/',
        fields: [
          {
            type: 'text',
            fieldName: 'Nombre del Productor', class: 'col-md-8',
            required: true,
            key: 'xproductor',
            bdType: 'text'
          },
          {
            type: 'text',
            required: false,
            fieldName: 'Codigo Super.', class: 'col-md-2',
            key: 'csuper',
            bdType: 'text'
          },
          { 
            type: 'select',
            fieldName: 'Tipo Productor', class: 'col-md-2',
            required: true,
            url: '/api/v1/maestros/tipo_produc',
            key: 'ctipo_productor',
            bdType: 'number'
          },
          {
            type: 'simple-select',
            fieldName: 'Identificacion', class: 'col-md-1',
            required: true,
            values: [{text: 'Selecciona una opcion...', value: '', selected: true},{text: 'Venezolano', value: 'V'}, {text: 'Extranjero', value: 'E'}, {text: 'Jurídico', value: 'J'}, {text: 'Pasaporte', value: 'P'}], 
            key: 'itipodoc',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Cédula', class: 'col-md-3',
            required: true,
            key: 'cci_rif',
            bdType: 'text'
          },
          { 
            type: 'select',
            fieldName: 'País', class: 'col-md-2',
            required: true,
            url: '/api/v1/maestros/paises',
            binding_change_fields: ['cestado'],
            change_fields: ['cestado', 'cciudad'],
            key: 'cpais',
            bdType: 'number'
          },
          {
            type: 'select',
            fieldName: 'Estado', class: 'col-md-2',
            required: true,
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
            required: true,
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
            fieldName: 'Dirección', class: 'col-md-6',
            key: 'xdireccion',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Correo', class: 'col-md-4',
            key: 'xcorreo',
            bdType: 'text'
          },
          {
            type: 'hidden',
            fieldName: 'Datos Bancarios', class: 'col-md-12 my-4 text',
            key: 'datos_bancarios',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Nº de Cuenta', class: 'col-md-4',
            required: true,
            key: 'xcuenta',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'RIF Bancario', class: 'col-md-2',
            required: true,
            key: 'cci_rif_banco',
            bdType: 'text'
          },
          {
            type: 'select',
            fieldName: 'Moneda', class: 'col-md-2',
            required: true,
            url: '/api/v1/maestros/monedas',
            binding_change_fields: ['cbanco'],
            change_fields: ['cbanco'],
            key: 'cmoneda',
            bdType: 'number'
          },
          {
            type: 'select',
            fieldName: 'Banco', class: 'col-md-4',
            required: true,
            url: '/api/v1/maestros/bancos',
            url_id: 'cmoneda',
            key: 'cbanco',
            bdType: 'number'
          },
          {
            type: 'text',
            fieldName: 'Teléfono', class: 'col-md-4',
            key: 'xtelefono_banco',
            bdType: 'text'
          },
          {
            type: 'simple-select',
            fieldName: 'Tipo de Cuenta', class: 'col-md-4',
            required: true,
            values: [{text: 'Selecciona una opcion...', value: '', selected: true},{text: 'Corriente', value: 'C'}, {text: 'Ahorro', value: 'A'}, {text: 'Otra', value: 'O'}], 
            key: 'itipo_cuenta',
            bdType: 'text'
          },
          {
            type: 'hidden',
            fieldName: 'Datos de Usuario', class: 'col-md-12 my-4 text',
            key: 'datos_usuario',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Usuario', class: 'col-md-2',
            required: true,
            key: 'xusuario',
            bdType: 'text'
          },
          {
            type: 'password',
            fieldName: 'Contraseña', class: 'col-md-2',
            required: true,
            key: 'xcontrasena',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Observacion', class: 'col-md-8',
            key: 'xobservacion',
            bdType: 'text'
          },
        ]
      } 
    },
    
  ];
  



