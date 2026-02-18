import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-maestros',
  templateUrl: './maestros.component.html',
  styleUrls: ['./maestros.component.scss']
})
export class MaestrosComponent implements OnInit {
  public isCollapsed = true;
  currentUser:any
  constructor() { }
  menuItems: any = [
    {
      text: 'Generales', icon: 'fa-solid fa-gear' , id: 'generales', items: [
        {text: 'Países', icon: 'fa-solid fa-flag', url: 'paises'},
        {text: 'Estados', icon: 'fa-solid fa-road', url: 'estados'},
        {text: 'Ciudades', icon: 'fa-solid fa-map-location-dot', url: 'ciudades'},
      ]
    },
    {
      text: 'Empresas', icon: 'fa-solid fa-building' , id: 'empresas', items: [
        {text: 'Bancos', icon: 'fa-solid fa-building-columns', url: 'bancos'},
        {text: 'Cedentes', icon: 'fa-solid fa-briefcase', url: 'cedentes'},
        {text: 'Monedas', icon: 'fa-solid fa-coins', url: 'monedas'},
      ]
    },
    {
      text: 'Personas', icon: 'fa-solid fa-user' , id: 'personas', items: [
        {text: 'Clientes', icon: 'fa-solid fa-id-card', url: 'clientes'},
        {text: 'Productores', icon: 'fa-solid fa-people-arrows', url: 'productores'},
      ]
    },
    {
      text: 'Del Negocio', icon: 'fa-solid fa-briefcase' , id: 'negocio', items: [
        {text: 'Vehículos', icon: 'fa-solid fa-car-side', url: 'vehiculos'},
        {text: 'Ramos', icon: 'fa-solid fa-file-lines', url: 'ramos'},
        {text: 'Productos', icon: 'fa-solid fa-scale-balanced', url: 'productos'},
        {text: 'Métodologías de Pago', icon: 'fa-solid fa-comments-dollar', url: 'metodologiapago'},
      ]
    },
  ]

  ngOnInit(): void {
    const storedSession = localStorage.getItem('user');
    this.currentUser = JSON.parse(storedSession);
    this.currentUser = this.currentUser.data.user
    console.log(this.currentUser)
    if([1,2,3].includes(this.currentUser.cusuario)){
      this.menuItems = [
        {
          text: 'Generales', icon: 'fa-solid fa-gear' , id: 'generales', items: [
            {text: 'Países', icon: 'fa-solid fa-flag', url: 'paises'},
            {text: 'Estados', icon: 'fa-solid fa-road', url: 'estados'},
            {text: 'Ciudades', icon: 'fa-solid fa-map-location-dot', url: 'ciudades'},
          ]
        },
        {
          text: 'Empresas', icon: 'fa-solid fa-building' , id: 'empresas', items: [
            {text: 'Bancos', icon: 'fa-solid fa-building-columns', url: 'bancos'},
            {text: 'Cedentes', icon: 'fa-solid fa-briefcase', url: 'cedentes'},
            {text: 'Monedas', icon: 'fa-solid fa-coins', url: 'monedas'},
          ]
        },
        {
          text: 'Personas', icon: 'fa-solid fa-user' , id: 'personas', items: [
            {text: 'Clientes', icon: 'fa-solid fa-id-card', url: 'clientes'},
            {text: 'Productores', icon: 'fa-solid fa-people-arrows', url: 'productores'},
            {text: 'Usuarios', icon: 'fa-solid fa-circle-user', url: 'usuarios'},
          ]
        },
        {
          text: 'Del Negocio', icon: 'fa-solid fa-briefcase' , id: 'negocio', items: [
            {text: 'Vehículos', icon: 'fa-solid fa-car-side', url: 'vehiculos'},
            {text: 'Ramos', icon: 'fa-solid fa-file-lines', url: 'ramos'},
            {text: 'Productos', icon: 'fa-solid fa-scale-balanced', url: 'productos'},
            {text: 'Métodologías de Pago', icon: 'fa-solid fa-comments-dollar', url: 'metodologiapago'},
          ]
        },
      ]
    }
  }

  collapse(){
    this.isCollapsed = !this.isCollapsed;
    const navbar = document.getElementsByTagName('nav')[0];
    if (!this.isCollapsed) {
      navbar.classList.remove('navbar-transparent');
      navbar.classList.add('bg-white');
    }else{
      navbar.classList.add('navbar-transparent');
      navbar.classList.remove('bg-white');
    }

  }

}
