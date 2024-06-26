import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { MaestrosComponent } from './maestros.component';


const routes: Routes =[
  {
    path: 'maestros',
    component: MaestrosComponent,
  },
  {
    path: 'maestros', children: [
      {
        path: '',
        loadChildren: () => 
            import('../../components/maestros/paises/paises.module').then(x=>x.PaisesModule)
      },
      {
        path: '',
        loadChildren: () => 
            import('../../components/maestros/estados/estados.module').then(x=>x.EstadosModule)
      },
      {
        path: '',
        loadChildren: () => 
            import('../../components/maestros/monedas/monedas.module').then(x=>x.MonedasModule)
      },
      {
        path: '',
        loadChildren: () => 
            import('../../components/maestros/metodologiapagos/metodologiapagos.module').then(x=>x.MetodologiapagoModule)
      },
      {
        path: '',
        loadChildren: () => 
            import('../../components/maestros/bancos/bancos.module').then(x=>x.BancosModule)
      },
      {
        path: '',
        loadChildren: () => 
            import('../../components/maestros/cedentes/cedentes.module').then(x=>x.CedentesModule)
      },
      {
        path: '',
        loadChildren: () => 
            import('../../components/maestros/asegurados/asegurados.module').then(x=>x.AseguradosModule)
      },
      {
        path: '',
        loadChildren: () => 
            import('../../components/maestros/agentes/agentes.module').then(x=>x.AgentesModule)
      },
      {
        path: '',
        loadChildren: () => 
            import('../../components/maestros/ejecutivos/ejecutivos.module').then(x=>x.EjecutivosModule)
      },
      {
        path: '',
        loadChildren: () => 
            import('../../components/maestros/productores/productores.module').then(x=>x.ProductoresModule)
      },
      {
        path: '',
        loadChildren: () => 
            import('../../components/maestros/tomadores/tomadores.module').then(x=>x.TomadoresModule)
      },
      {
        path: '',
        loadChildren: () => 
            import('../../components/maestros/ramos/ramos.module').then(x=>x.RamosModule)
      },
      {
        path: '',
        loadChildren: () => 
            import('../../components/maestros/marcas/marcas.module').then(x=>x.MarcasModule)
      },
      {
        path: '',
        loadChildren: () => 
            import('../../components/maestros/planes/planes.module').then(x=>x.PlanesModule)
      },
      {
        path: '',
        loadChildren: () => 
            import('../../components/maestros/coberturas/coberturas.module').then(x=>x.CoberturasModule)
      },
      {
        path: '',
        loadChildren: () => 
            import('../../components/maestros/aranceles/aranceles.module').then(x=>x.ArancelesModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaestrosRoutingModule { }
