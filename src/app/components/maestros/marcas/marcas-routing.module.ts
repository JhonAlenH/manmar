import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TableListComponent } from './../../table-list/table-list.component';
import { ItemFormComponent } from './../../item-form/item-form.component';

  export const MarcasRoutes: Routes = [
    { 
      path: 'marcas',      component: TableListComponent, data: {
        title: 'Marcas',
        url: '/api/v1/maestros/marcas/search',
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
      path: 'marcas/create',   component: ItemFormComponent, data: {
        title: 'Crear Nueva Marca',
        mode: 'create',
        mainUrl: '/api/v1/maestros/marcas/get/',
        createUrl: '/api/v1/maestros/marcas/create',
        formId: 'create_marcas',
        fields: [      
          {
            type: 'text',
            fieldName: 'Codigo de Marca', class: 'col-md-2',
            key: 'cmarca',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Descripción Marca', class: 'col-md-10',
            key: 'xmarca',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Codigo de Modelo', class: 'col-md-2',
            key: 'cmodelo',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Descripción Modelo', class: 'col-md-10',
            key: 'xmodelo',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Codigo de Versión', class: 'col-md-2',
            key: 'cversion',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Descripción Versión', class: 'col-md-10',
            key: 'xversion',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Transmisión', class: 'col-md-3',
            key: 'xtrans',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Motor', class: 'col-md-3',
            key: 'xmotor',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Año', class: 'col-md-2',
            key: 'qano',
            bdType: 'text'
          }
        ]
      } 
    },
    { 
      path: 'marcas/info/:id',   component: ItemFormComponent, data: {
        title: 'Marca, Modelo y Versión',
        mode: 'info',
        mainUrl: '/api/v1/maestros/marcas/get/',
        editUrl: '/api/v1/maestros/marcas/edit/',
        formId: 'edit_marcas',
        // dsf
        disableUrl: '/api/v1/maestros/marcas/disable/',
        fields: [     
          {
            type: 'text',
            fieldName: 'Codigo de Marca', class: 'col-md-2',
            key: 'cmarca',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Descripción Marca', class: 'col-md-10',
            key: 'xmarca',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Codigo de Modelo', class: 'col-md-2',
            key: 'cmodelo',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Descripción Modelo', class: 'col-md-10',
            key: 'xmodelo',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Codigo de Versión', class: 'col-md-2',
            key: 'cversion',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Descripción Versión', class: 'col-md-10',
            key: 'xversion',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Transmisión', class: 'col-md-3',
            key: 'xtrans',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Motor', class: 'col-md-3',
            key: 'xmotor',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Año', class: 'col-md-2',
            key: 'qano',
            bdType: 'text'
          }
        ]
      } 
    },
    
  ];
  

