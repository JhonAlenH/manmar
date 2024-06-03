import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TableListComponent } from './../../table-list/table-list.component';
import { ItemFormComponent } from './../../item-form/item-form.component';

  export const AgentesRoutes: Routes = [
    { 
      path: 'agentes',      component: TableListComponent, data: {
        title: 'Agentes',
        url: '/api/v1/maestros/agentes/search',
        tableId: 'agentes',
        tableInfo: [
          { headerName: 'Agente', key: 'cagente', primary_key: true },
          { headerName: 'Nombre Ejecutivo', key: 'xejecutivo', primary_key: true },
          { headerName: 'Nombre y Apellido', key: 'xagente' },
          { headerName: 'Cédula', key: 'xrif' },          
        ],
        extraInfo: [
          {headerName: 'Informacion', action:'info', icon: 'fa-solid fa-edit', url:'info/'},
          // {headerName: 'Certificado', action:'see_certify', icon: 'fa-solid fa-paperclip', url:'/api/v1/plan/verCertificado/'}
        ]
      }
    },
    { 
      path: 'agentes/create',   component: ItemFormComponent, data: {
        title: 'Crear Nuevo Agente',
        mode: 'create',
        mainUrl: '/api/v1/maestros/agentes/get/',
        createUrl: '/api/v1/maestros/agentes/create', 
        formId: 'create_agentes',
        fields: [      
          {
            type: 'text',
            fieldName: 'Nombre y Apellido', class: 'col-md-10',
            key: 'xagente',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Cédula', class: 'col-md-2',
            key: 'xrif',
            bdType: 'text'
          },
          {
            type: 'simple-select',
            fieldName: 'Ejecutivo',
            class: 'col-md-4',
            url: '/api/v1/maestros/ejecutivos/searchMaestros',
            key: 'cejecutivo',
            bdType: 'number'
          },
          {
            type: 'text',
            fieldName: 'Dirección', class: 'col-md-8',
            key: 'xdireccion',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Teléfono', class: 'col-md-3',
            key: 'xtelefono',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'eMail', class: 'col-md-3',
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
            fieldName: '% comisión', class: 'col-md-3',
            key: 'pcomision',
            bdType: 'text'
          }      
        ]
      } 
    },
    { 
      path: 'agentes/info/:id',   component: ItemFormComponent, data: {
        title: 'Información del Agente',
        mode: 'info',
        mainUrl: '/api/v1/maestros/agentes/get/',
        editUrl: '/api/v1/maestros/agentes/edit/',
        formId: 'edit_agentes',
        disableUrl: '/api/v1/maestros/agentes/disable/',
        fields: [     

          {
            type: 'text',
            fieldName: 'Nombre y Apellido', class: 'col-md-10',
            key: 'xagente',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Cédula', class: 'col-md-2',
            key: 'xrif',
            bdType: 'text'
          },
          {
            type: 'simple-select',
            fieldName: 'Ejecutivo',
            class: 'col-md-4',
            url: '/api/v1/maestros/ejecutivos/searchMaestros',
            key: 'cejecutivo',
            bdType: 'number'
          },
          {
            type: 'text',
            fieldName: 'Dirección', class: 'col-md-8',
            key: 'xdireccion',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Teléfono', class: 'col-md-3',
            key: 'xtelefono',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'eMail', class: 'col-md-3',
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
            fieldName: '% comisión', class: 'col-md-3',
            key: 'pcomision',
            bdType: 'text'
          } 
        ]
      } 
    },
    
  ];
  

