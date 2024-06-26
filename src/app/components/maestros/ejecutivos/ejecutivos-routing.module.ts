import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TableListComponent } from './../../table-list/table-list.component';
import { ItemFormComponent } from './../../item-form/item-form.component';

  export const EjecutivosRoutes: Routes = [
    { 
      path: 'ejecutivos',      component: TableListComponent, data: {
        title: 'Ejecutivos',
        url: '/api/v1/maestros/ejecutivos/search',
        tableId: 'ejecutivos',
        tableInfo: [
          { headerName: 'Ejecutivo', key: 'cejecutivo', primary_key: true },
          { headerName: 'Nombre ', key: 'xejecutivo', primary_key: true },
          { headerName: 'Cédula', key: 'xrif' },          
        ],
        extraInfo: [
          {headerName: 'Informacion', action:'info', icon: 'fa-solid fa-edit', url:'info/'},
          // {headerName: 'Certificado', action:'see_certify', icon: 'fa-solid fa-paperclip', url:'/api/v1/plan/verCertificado/'}
        ]
      }
    },
    { 
      path: 'ejecutivos/create',   component: ItemFormComponent, data: {
        title: 'Crear Nuevo Ejecutivo',
        mode: 'create',
        mainUrl: '/api/v1/maestros/ejecutivos/get/',
        createUrl: '/api/v1/maestros/ejecutivos/create', 
        formId: 'create_ejecutivos',
        fields: [   

          {
            type: 'text',
            fieldName: 'Cédula', class: 'col-md-2',
            key: 'xrif',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Nombre y Apellido', class: 'col-md-10',
            key: 'xejecutivo',
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
            fieldName: 'Teléfono 1', class: 'col-md-4',
            key: 'xtelefono1',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Teléfono 2', class: 'col-md-4',
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
            fieldName: 'No Cuenta Nacional', class: 'col-md-3',
            key: 'xcta_nacional',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'No. Cuenta Extranjero', class: 'col-md-3',
            key: 'xcta_extranjero',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: '% de Comisión', class: 'col-md-2',
            key: 'pcomision',
            bdType: 'text'
          },
          {
            type: 'simple-select',
            fieldName: 'Estatus del Registro',
            class: 'col-md-2',
            values: [{text: 'Activo', value: '1'}, {text: 'Inactivo', value: '0'}],
            key: 'bactivo',
            bdType: 'number'
          }      
        ]
      } 
    },
    { 

      path: 'ejecutivos/info/:id',   component: ItemFormComponent, data: {
        title: 'Información del Ejecutivo',
        mode: 'info',
        mainUrl: '/api/v1/maestros/ejecutivos/get/',
        createUrl: '/api/v1/maestros/ejecutivos/create/',
        editUrl: '/api/v1/maestros/ejecutivos/edit/',
        formId: 'edit_ejecutivos',
        disableUrl: '/api/v1/maestros/ejecutivos/disable/',
        fields: [     

          {
            type: 'text',
            fieldName: 'Cédula', class: 'col-md-2',
            key: 'xrif',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Nombre y Apellido', class: 'col-md-10',
            key: 'xejecutivo',
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
            fieldName: 'Teléfono 1', class: 'col-md-4',
            key: 'xtelefono1',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Teléfono 2', class: 'col-md-4',
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
            fieldName: 'No Cuenta Nacional', class: 'col-md-3',
            key: 'xcta_nacional',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'No. Cuenta Extranjero', class: 'col-md-3',
            key: 'xcta_extranjero',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: '% de Comisión', class: 'col-md-2',
            key: 'pcomision',
            bdType: 'text'
          },
          {
            type: 'simple-select',
            fieldName: 'Estatus del Registro',
            class: 'col-md-2',
            values: [{text: 'Activo', value: '1'}, {text: 'Inactivo', value: '0'}],
            key: 'bactivo',
            bdType: 'number'
          } 
        ]
      } 
    },
    
  ];
  


