import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { EmissionsComponent } from '../../pages/emissions/emissions.component';
import { SearchContractsComponent } from '../../pages/emissions/search-contracts/search-contracts.component';
import { DetailContractsComponent } from '../../pages/emissions/detail-contracts/detail-contracts.component';
import { AdministratorComponent } from '../../pages/administrator/administrator.component';
import { MaestrosComponent } from 'src/app/components/maestros/maestros.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    {
      path: '',
      loadChildren: () => import('src/app/components/maestros/maestros.module').then(m => m.MaestrosModule)
    },
    { path: 'search-contract',      component: SearchContractsComponent },
    { path: 'detail-contract',      component: DetailContractsComponent },
    { path: 'emissions',      component: EmissionsComponent },
    { path: 'administrator',      component: AdministratorComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'tables',         component: TablesComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent }
];
