import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TableListComponent } from '../../table-list/table-list.component';
import { ItemFormComponent } from '../../item-form/item-form.component';

  export const ProductosRoutes: Routes = [
    { 
      path: 'productos',      component: TableListComponent, data: {
        title: 'Productos',
        url: '/api/v1/maestros/productos/search',
        editUrl: '/api/v1/maestros/productos/edit/',
        tableId: 'productos',
        tableInfo: [
          { headerName: 'ID', key: 'cproducto', primary_key: true },
          { headerName: 'Producto', key: 'xproducto' },
          { headerName: 'Ramo', key: 'xramo' },
          { headerName: 'Cedente', key: 'xcedente' },
        ],
        extraInfo: [
          {headerName: 'Informacion', action:'info', icon: 'fa-solid fa-edit', url:'info/'},
          // {headerName: 'Certificado', action:'see_certify', icon: 'fa-solid fa-paperclip', url:'/api/v1/plan/verCertificado/'}
        ]
      }
    },
    { 
      path: 'productos/create',   component: ItemFormComponent, data: {
        title: 'Crear Nuevo Producto',
        mode: 'create',
        mainUrl: '/api/v1/maestros/productos/get/',
        createUrl: '/api/v1/maestros/productos/create',
        formId: 'create_productos',
        fields: [     
          {
            type: 'text',
            fieldName: 'Nombre del Producto', class: 'col-md-4',
            required: true,
            key: 'xproducto',
            bdType: 'text'
          },
          { 
            type: 'select',
            fieldName: 'Ramo', class: 'col-md-4',
            required: true,
            url: '/api/v1/maestros/ramos',
            key: 'cramo',
            bdType: 'number'
          },
          { 
            type: 'select',
            fieldName: 'Cedente', class: 'col-md-4',
            required: true,
            url: '/api/v1/maestros/cedentes',
            key: 'ccedente',
            bdType: 'number'
          },
          { 
            type: 'select',
            fieldName: 'Moneda', class: 'col-md-2',
            required: true,
            url: '/api/v1/maestros/monedas',
            key: 'cmoneda',
            bdType: 'number'
          },
          { 
            type: 'number',
            fieldName: '% Comision', class: 'col-md-2',
            required: false,
            key: 'pcomision',
            bdType: 'number'
          },
        ]
      } 
    },
    { 
      path: 'productos/info/:id',   component: ItemFormComponent, data: {
        title: 'Información del Producto',
        mode: 'info',
        mainUrl: '/api/v1/maestros/productos/get/',
        editUrl: '/api/v1/maestros/productos/edit/',
        formId: 'edit_productos',
        disableUrl: '/api/v1/maestros/productos/disable/',
        fields: [     
          {
            type: 'text',
            fieldName: 'Nombre del Producto', class: 'col-md-4',
            required: true,
            key: 'xproducto',
            bdType: 'text'
          },
          { 
            type: 'select',
            fieldName: 'Ramo', class: 'col-md-4',
            required: true,
            url: '/api/v1/maestros/ramos',
            key: 'cramo',
            bdType: 'number'
          },
          { 
            type: 'select',
            fieldName: 'Cedente', class: 'col-md-4',
            required: true,
            url: '/api/v1/maestros/cedentes',
            key: 'ccedente',
            bdType: 'number'
          },
          { 
            type: 'select',
            fieldName: 'Moneda', class: 'col-md-2',
            required: true,
            url: '/api/v1/maestros/monedas',
            key: 'cmoneda',
            bdType: 'number'
          },
          { 
            type: 'number',
            fieldName: '% Comision', class: 'col-md-2',
            required: false,
            key: 'pcomision',
            bdType: 'number'
          },
        ]
      } 
    },
    
  ];
  

