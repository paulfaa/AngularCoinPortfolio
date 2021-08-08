import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCoinComponent } from '../add-coin/add-coin.component';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'portfolio',
        loadChildren: () => import('../portfolio/portfolio.module').then(m => m.PortfolioPageModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('../settings/settings.module').then(m => m.SettingsPageModule)
      },
      {
        path: 'add-coin', component: AddCoinComponent
      },
      {
        path: '',
        redirectTo: '/tabs/portfolio',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/portfolio',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
