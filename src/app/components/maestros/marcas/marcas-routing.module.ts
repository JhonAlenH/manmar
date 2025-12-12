import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TableListComponent } from './../../table-list/table-list.component';
import { ItemFormComponent } from './../../item-form/item-form.component';

  export const MarcasRoutes: Routes = [
    { 
      path: 'vehiculos',      component: TableListComponent, data: {
        title: 'Vehiculos',
        url: '/api/v1/maestros/vehiculos/search',
        tableId: 'marcas',
        tableInfo: [
          { headerName: 'Código', key: 'ccodigo', primary_key: true },
          { headerName: 'Marca', key: 'xmarca' },
          { headerName: 'Modelo', key: 'xmodelo' },
          { headerName: 'Versión', key: 'xversion' },
          { headerName: 'Año', key: 'qano' },
        ],
        extraInfo: [
          {headerName: 'Informacion', action:'info', icon: 'fa-solid fa-edit', url:'info/'},
          // {headerName: 'Certificado', action:'see_certify', icon: 'fa-solid fa-paperclip', url:'/api/v1/plan/verCertificado/'}
        ]
      }
    },
    { 
      path: 'vehiculos/create',   component: ItemFormComponent, data: {
        title: 'Crear Vehículo',
        mode: 'create',
        mainUrl: '/api/v1/maestros/vehiculos/get/',
        createUrl: '/api/v1/maestros/vehiculos/create',
        formId: 'create_vehiculos',
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
            type: 'auto-select',
            fieldName: 'Marca', class: 'col-md-2',
            classShow: 'col-md-4',
            url: '/api/v1/maestros/marcas',
            binding_change_fields: ['cmodelo'],
            change_fields: ['cmodelo', 'cversion', 'xmarca'],
            key: 'cmarca',
            bdType: 'text'
          },
          {
            type: 'auto-text',
            fieldName: 'Nombre Marca', class: 'col-md-2',
            key: 'xmarca',
            reverse: true,
            bdType: 'text'
          },
          {
            type: 'auto-select',
            fieldName: 'Modelo', class: 'col-md-2',
            classShow: 'col-md-4',
            url: '/api/v1/maestros/modelos',
            url_ids: ['cmarca'],
            binding_change_fields: ['cversion'],
            change_fields: ['cversion', 'xmodelo'],
            key: 'cmodelo',
            bdType: 'text'
          },
          {
            type: 'auto-text',
            fieldName: 'Nombre Modelo', class: 'col-md-2',
            key: 'xmodelo',
            reverse: true,
            bdType: 'text'
          },
          {
            type: 'auto-select',
            fieldName: 'Versión', class: 'col-md-2',
            classShow: 'col-md-4',
            url: '/api/v1/maestros/versiones',
            url_ids: ['cmarca','cmodelo'],
            change_fields: ['xversion'],
            key: 'cversion',
            bdType: 'text'
          },
          {
            type: 'auto-text',
            fieldName: 'Nombre Versión', class: 'col-md-2',
            key: 'xversion',
            reverse: true,
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Transmisión', class: 'col-md-7',
            key: 'xtrans',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Motor', class: 'col-md-4',
            key: 'xmotor',
            bdType: 'text'
          },
          {
            type: 'number',
            fieldName: 'Año', class: 'col-md-1',
            key: 'qano',
            change_fields: ['cmarca', 'cmodelo', 'cversion'],
            bdType: 'number'
          }
        ]
      }
    },
    { 
      path: 'vehiculos/info/:id',   component: ItemFormComponent, data: {
        title: 'Editar Vehículo',
        mode: 'info',
        mainUrl: '/api/v1/maestros/vehiculos/get/',
        editUrl: '/api/v1/maestros/vehiculos/edit/',
        formId: 'edit_vehiculos',
        disableUrl: '/api/v1/maestros/vehiculos/disable/',
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
            type: 'auto-select',
            fieldName: 'Marca', class: 'col-md-2',
            classShow: 'col-md-4',
            url: '/api/v1/maestros/marcas',
            binding_change_fields: ['cmodelo'],
            change_fields: ['cmodelo', 'cversion', 'xmarca'],
            key: 'cmarca',
            bdType: 'text'
          },
          {
            type: 'auto-text',
            fieldName: 'Nombre Marca', class: 'col-md-2',
            key: 'xmarca',
            reverse: true,
            bdType: 'text'
          },
          {
            type: 'auto-select',
            fieldName: 'Modelo', class: 'col-md-2',
            classShow: 'col-md-4',
            url: '/api/v1/maestros/modelos',
            url_ids: ['cmarca'],
            binding_change_fields: ['cversion'],
            change_fields: ['cversion', 'xmodelo'],
            key: 'cmodelo',
            bdType: 'text'
          },
          {
            type: 'auto-text',
            fieldName: 'Nombre Modelo', class: 'col-md-2',
            key: 'xmodelo',
            reverse: true,
            bdType: 'text'
          },
          {
            type: 'auto-select',
            fieldName: 'Versión', class: 'col-md-2',
            classShow: 'col-md-4',
            url: '/api/v1/maestros/versiones',
            url_ids: ['cmarca','cmodelo'],
            change_fields: ['xversion'],
            key: 'cversion',
            bdType: 'text'
          },
          {
            type: 'auto-text',
            fieldName: 'Nombre Versión', class: 'col-md-2',
            key: 'xversion',
            reverse: true,
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Transmisión', class: 'col-md-7',
            key: 'xtrans',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Motor', class: 'col-md-4',
            key: 'xmotor',
            bdType: 'text'
          },
          {
            type: 'number',
            fieldName: 'Año', class: 'col-md-1',
            key: 'qano',
            change_fields: ['cmarca', 'cmodelo', 'cversion'],
            bdType: 'number'
          }
        ]
      } 
    },
    
  ];
  

