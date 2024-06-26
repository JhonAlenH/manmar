import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-maestros',
  templateUrl: './maestros.component.html',
  styleUrls: ['./maestros.component.scss']
})
export class MaestrosComponent implements OnInit {
  public isCollapsed = true;
  constructor() { }
  menuItems: any = [
    {
      text: 'Generales', icon: 'fa-solid fa-gear' , id: 'generales', items: [
        {text: 'Países', icon: 'location_world now-ui-icons', url: 'paises'},
        {text: 'Estados', icon: 'fa-solid fa-map-location-dot', url: 'estados'},
        {text: 'Ciudades', icon: 'fa-solid fa-road', url: '#'},
        {text: 'Monedas', icon: 'fa-solid fa-coins', url: 'monedas'},
        {text: 'Métodologías de Pago', icon: 'fa-solid fa-comments-dollar', url: 'metodologiapago'},
      ]
    },
    {
      text: 'Empresas', icon: 'fa-solid fa-building' , id: 'empresas', items: [
        {text: 'Bancos', icon: 'business_bank now-ui-icons', url: 'bancos'},
        {text: 'Cedentes', icon: 'shopping_delivery-fast now-ui-icons', url: 'cedentes'},
      ]
    },
    {
      text: 'Personas', icon: 'fa-regular fa-user' , id: 'personas', items: [
        {text: 'Asegurados', icon: 'fa-sharp fa-regular fa-circle-user', url: 'asegurados'},
        {text: 'Agentes', icon: 'fa-sharp fa-solid fa-circle-user', url: 'agentes'},
        {text: 'Ejecutivos', icon: 'fa-solid fa-people-group', url: 'ejecutivos'}, 
        {text: 'Productores', icon: 'fa-solid fa-ring', url: 'productores'},
        {text: 'Tomadores', icon: 'fa-sharp fa-solid fa-circle-user', url: 'tomadores'},
      ]
    },
    {
      text: 'Del Negocio', icon: 'fa-solid fa-briefcase' , id: 'negocio', items: [
        {text: 'Marcas, Modelos y Versiones', icon: 'fa-solid fa-file-lines', url: 'marcas'},
        {text: 'Ramos', icon: 'fa-solid fa-car-side', url: 'ramos'},
        {text: 'Planes', icon: 'fa-solid fa-car-side', url: 'planes'},
        {text: 'Coberturas', icon: 'fa-solid fa-car-side', url: 'coberturas'},
        {text: 'Aranceles', icon: 'fa-solid fa-car-side', url: 'aranceles'},
      ]
    },
  ]

  ngOnInit(): void {
  }

  collapse(){
    this.isCollapsed = !this.isCollapsed;
    const navbar = document.getElementsByTagName('nav')[0];
    console.log(navbar);
    if (!this.isCollapsed) {
      navbar.classList.remove('navbar-transparent');
      navbar.classList.add('bg-white');
    }else{
      navbar.classList.add('navbar-transparent');
      navbar.classList.remove('bg-white');
    }

  }

}
