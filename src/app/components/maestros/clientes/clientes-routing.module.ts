import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TableListComponent } from '../../table-list/table-list.component';
import { ItemFormComponent } from '../../item-form/item-form.component';

  export const ClientesRoutes: Routes = [
    { 
      path: 'clientes',      component: TableListComponent, data: {
        title: 'Clientes',
        url: '/api/v1/maestros/clientes/search',
        tableId: 'clientes',
        tableInfo: [
          { headerName: 'ID', key: 'id', primary_key: true },
          { headerName: 'Cédula', key: 'cci_rif' },
          { headerName: 'Nombre', key: 'xnombre' },
          { headerName: 'Apellido', key: 'xapellido' },
          { headerName: 'Fecha de Nacimiento', key: 'fnacimiento' },
        ],
        extraInfo: [
          {headerName: 'Informacion', action:'info', icon: 'fa-solid fa-edit', url:'info/'},
          // {headerName: 'Certificado', action:'see_certify', icon: 'fa-solid fa-paperclip', url:'/api/v1/plan/verCertificado/'}
        ]
      }
    },
    { 
      path: 'clientes/create',   component: ItemFormComponent, data: {
        title: 'Crear Nuevo Cliente',
        mode: 'create',
        mainUrl: '/api/v1/maestros/clientes/get/',
        createUrl: '/api/v1/maestros/clientes/create', 
        formId: 'create_clientes',
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
            key: 'cci_rif',
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
            type: 'email',
            fieldName: 'Correo', class: 'col-md-2',
            key: 'xcorreo',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Direccion', class: 'col-md-6',
            key: 'xdireccion',
            bdType: 'text'
          }
        ]
      }
    },
    { 
      path: 'clientes/info/:id',   component: ItemFormComponent, data: {
        title: 'Información del Cliente',
        mode: 'info',
        mainUrl: '/api/v1/maestros/clientes/get/',
        editUrl: '/api/v1/maestros/clientes/edit/',
        formId: 'edit_clientes',
        disableUrl: '/api/v1/maestros/clientes/disable/',
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
            key: 'cci_rif',
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
          }
        ]
      } 
    },
    
  ];
  

