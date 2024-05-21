import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { EmissionsComponent } from '../../pages/emissions/emissions.component';
import { MaestrosComponent } from 'src/app/components/maestros/maestros.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    {
        path: 'maestros',
        component: MaestrosComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('src/app/components/maestros/maestros.module').then(m => m.MaestrosModule)
          }
        ]
    },
    { path: 'emissions',      component: EmissionsComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'tables',         component: TablesComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent }
];
