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
        {text: 'Estados', icon: 'fa-solid fa-map-location-dot', url: '#'},
        {text: 'Ciudades', icon: 'fa-solid fa-road', url: '#'},
        {text: 'Monedas', icon: 'fa-solid fa-coins', url: 'monedas'},
        {text: 'Métodologías de Pago', icon: 'fa-solid fa-comments-dollar', url: 'metodologiapago'},
        {text: 'Estatus', icon: 'fa-solid fa-toggle-on', url: '#'},
      ]
    },
    {
      text: 'Empresas', icon: 'fa-solid fa-building' , id: 'empresas', items: [
        {text: 'Compañías', icon: 'fa-solid fa-city', url: 'companias'},
        {text: 'Bancos', icon: 'business_bank now-ui-icons', url: 'bancos'},
        {text: 'Proveedores', icon: 'shopping_delivery-fast now-ui-icons', url: 'proveedores'},
      ]
    },
    {
      text: 'Personas', icon: 'fa-regular fa-user' , id: 'personas', items: [
        {text: 'Doc. Identidad', icon: 'fa-regular fa-id-badge', url: 'tipodocidentidad'},
        {text: 'Estado Civil', icon: 'fa-solid fa-ring', url: 'estadocivil'},
        {text: 'Parentescos', icon: 'fa-solid fa-people-group', url: 'parentescos'},
        {text: 'Propietarios', icon: 'tech_laptop now-ui-icons', url: 'propietarios'},
      ]
    },
    {
      text: 'Del Negocio', icon: 'fa-solid fa-briefcase' , id: 'negocio', items: [
        {text: 'Marcas, Modelos y Versiones', icon: 'fa-regular fa-file-lines', url: 'marcas'},
        {text: 'Vehículos', icon: 'fa-solid fa-car-side', url: 'vehiculos'},
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
