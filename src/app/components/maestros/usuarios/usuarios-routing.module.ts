import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TableListComponent } from '../../table-list/table-list.component';
import { ItemFormComponent } from '../../item-form/item-form.component';

  export const UsuariosRoutes: Routes = [
    { 
      path: 'usuarios',      component: TableListComponent, data: {
        title: 'Usuarios',
        url: '/api/v1/maestros/usuarios/search',
        editUrl: '/api/v1/maestros/usuarios/edit/',
        userVar: 'cproductor',
        tableId: 'usuarios',
        tableInfo: [
          { headerName: 'Código', key: 'cusuario', primary_key: true },
          { headerName: 'Usuario', key: 'xusuario' },
          { headerName: 'Rol', key: 'xrol' }
        ],
        extraInfo: [
          {headerName: 'Informacion', action:'info', icon: 'fa-solid fa-edit', url:'info/'},
          // {headerName: 'Certificado', action:'see_certify', icon: 'fa-solid fa-paperclip', url:'/api/v1/plan/verCertificado/'}
        ]
      }
    },
    { 
      path: 'usuarios/create',   component: ItemFormComponent, data: {
        title: 'Crear Nuevo Usuario',
        mode: 'create',
        mainUrl: '/api/v1/maestros/usuarios/get/',
        createUrl: '/api/v1/maestros/usuarios/create',
        formId: 'create_usuarios',
        fields: [     
          {
            type: 'text',
            fieldName: 'Usuario', class: 'col-md-4',
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
            fieldName: 'Observación', class: 'col-md-6',
            key: 'xobservacion',
            bdType: 'text'
          },
          { 
            type: 'select',
            fieldName: 'Rol', class: 'col-md-2',
            required: true,
            url: '/api/v1/maestros/roles',
            userVar: 'crol',
            key: 'crol',
            bdType: 'number'
          },
          {
            type: 'hidden',
            fieldName: 'Datos personales', class: 'col-md-12 my-4 text',
            key: 'datos_personales',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Nombre', class: 'col-md-6',
            required: true,
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
        ]
      } 
    },
    { 
      path: 'usuarios/info/:id',   component: ItemFormComponent, data: {
        title: 'Información del Usuario',
        mode: 'info',
        mainUrl: '/api/v1/maestros/usuarios/get/',
        editUrl: '/api/v1/maestros/usuarios/edit/',
        formId: 'edit_usuarios',
        disableUrl: '/api/v1/maestros/usuarios/disable/',
        fields: [     
          {
            type: 'text',
            fieldName: 'Usuario', class: 'col-md-4',
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
            fieldName: 'Observación', class: 'col-md-6',
            key: 'xobservacion',
            bdType: 'text'
          },
          { 
            type: 'select',
            fieldName: 'Rol', class: 'col-md-2',
            required: true,
            url: '/api/v1/maestros/roles',
            key: 'crol',
            bdType: 'number'
          },
          {
            type: 'hidden',
            fieldName: 'Datos personales', class: 'col-md-12 my-4 text',
            key: 'datos_personales',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Nombre', class: 'col-md-6',
            required: true,
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
        ]
      } 
    },
    
  ];
  

