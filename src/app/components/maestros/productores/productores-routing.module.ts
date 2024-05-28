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
          { headerName: 'Nombre Productor', key: 'xproductor', primary_key: true },
          { headerName: 'Cédula/Rif', key: 'xrif' },          
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
            fieldName: 'Nombre del Productor', class: 'col-md-10',
            key: 'xproductor',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Cédula', class: 'col-md-2',
            key: 'xrif',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Codigo Super.', class: 'col-md-3',
            key: 'csuper',
            bdType: 'text'
          }, 
          {
            type: 'text',
            fieldName: 'País', class: 'col-md-3',
            key: 'cpais',
            bdType: 'text'
          },  
          {
            type: 'text',
            fieldName: 'Estado', class: 'col-md-3',
            key: 'cestado',
            bdType: 'text'
          }, 
          {
            type: 'text',
            fieldName: 'Ciudad', class: 'col-md-3',
            key: 'cciudad',
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
            fieldName: 'Teléfono', class: 'col-md-4',
            key: 'xtelefono',
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
            fieldName: 'No Cuenta Nacional', class: 'col-md-4',
            key: 'xcta_nacional',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'No. Cuenta Extranjero', class: 'col-md-4',
            key: 'xcta_extranjero',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: '% de Comisión', class: 'col-md-2',
            key: 'pcomision',
            bdType: 'text'
          }       
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
            fieldName: 'Nombre del Productor', class: 'col-md-10',
            key: 'xproductor',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Cédula', class: 'col-md-2',
            key: 'xrif',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'Codigo Super.', class: 'col-md-3',
            key: 'csuper',
            bdType: 'text'
          }, 
          {
            type: 'text',
            fieldName: 'País', class: 'col-md-3',
            key: 'cpais',
            bdType: 'text'
          },  
          {
            type: 'text',
            fieldName: 'Estado', class: 'col-md-3',
            key: 'cestado',
            bdType: 'text'
          }, 
          {
            type: 'text',
            fieldName: 'Ciudad', class: 'col-md-3',
            key: 'cciudad',
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
            fieldName: 'Teléfono', class: 'col-md-4',
            key: 'xtelefono',
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
            fieldName: 'No Cuenta Nacional', class: 'col-md-4',
            key: 'xcta_nacional',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: 'No. Cuenta Extranjero', class: 'col-md-4',
            key: 'xcta_extranjero',
            bdType: 'text'
          },
          {
            type: 'text',
            fieldName: '% de Comisión', class: 'col-md-2',
            key: 'pcomision',
            bdType: 'text'
          } 
        ]
      } 
    },
    
  ];
  



