import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TableListComponent } from '../../table-list/table-list.component';
import { ItemFormComponent } from '../../item-form/item-form.component';

  export const CiudadesRoutes: Routes = [
    { 
      path: 'ciudades',      component: TableListComponent, data: {
        title: 'Ciudades',
        url: '/api/v1/maestros/ciudades/search',
        editUrl: '/api/v1/maestros/ciudades/edit/',
        tableId: 'ciudades',
        tableInfo: [
          { headerName: 'Codigo', key: 'cciudad', primary_key: true },
          { headerName: 'Ciudad', key: 'xciudad' },
          { headerName: 'Estado', key: 'xestado' },
          { headerName: 'Pais', key: 'xpais' },
        ],
        extraInfo: [
          {headerName: 'Informacion', action:'info', icon: 'fa-solid fa-edit', url:'info/'},
          // {headerName: 'Certificado', action:'see_certify', icon: 'fa-solid fa-paperclip', url:'/api/v1/plan/verCertificado/'}
        ]
      }
    },
    { 
      path: 'ciudades/create',   component: ItemFormComponent, data: {
        title: 'Crear Nueva Ciudad',
        mode: 'create',
        mainUrl: '/api/v1/maestros/ciudades',
        createUrl: '/api/v1/maestros/ciudades/create',
        formId: 'create_ciudades',
        fields: [
          { 
            type: 'select',
            fieldName: 'País', class: 'col-md-2',
            required: true,
            url: '/api/v1/maestros/paises',
            binding_change_fields: ['cestado'],
            change_fields: ['cestado'],
            key: 'cpais',
            bdType: 'number'
          },
          {
            type: 'select',
            fieldName: 'Estado', class: 'col-md-2',
            required: true,
            key: 'cestado',
            url_id: 'cpais',
            url: '/api/v1/maestros/estados',
            bdType: 'number'
          },
          {
            type: 'text',
            fieldName: 'Ciudad', class: 'col-md-8',
            required: true,
            key: 'xciudad',
            bdType: 'text'
          }  
        ]
      } 
    },
    { 
      path: 'ciudades/info/:id',   component: ItemFormComponent, data: {
        title: 'Información de la Ciudad',
        mode: 'info',
        mainUrl: '/api/v1/maestros/ciudades/get/',
        editUrl: '/api/v1/maestros/ciudades/edit/',
        formId: 'edit_ciudades',
        disableUrl: '/api/v1/maestros/ciudades/disable/',
        fields: [
          { 
            type: 'select',
            fieldName: 'País', class: 'col-md-2',
            required: true,
            url: '/api/v1/maestros/paises',
            binding_change_fields: ['cestado'],
            change_fields: ['cestado'],
            key: 'cpais',
            bdType: 'number'
          },
          {
            type: 'select',
            fieldName: 'Estado', class: 'col-md-2',
            required: true,
            key: 'cestado',
            url_id: 'cpais',
            url: '/api/v1/maestros/estados',
            bdType: 'number'
          },
          {
            type: 'text',
            fieldName: 'Ciudad', class: 'col-md-8',
            required: true,
            key: 'xciudad',
            bdType: 'text'
          }  
        ]
      } 
    },
    
  ];
  

