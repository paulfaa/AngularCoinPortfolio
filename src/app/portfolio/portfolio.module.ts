import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule, NavController } from '@ionic/angular';

import { PortfolioPageRoutingModule } from './portfolio-routing.module';

import { PortfolioPage } from './portfolio.page';
import { SharedModule } from '../shared/pipes/shared.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PortfolioPageRoutingModule,
    SharedModule
  ],
  declarations: [PortfolioPage]
})
export class PortfolioPageModule {
  public navController: NavController;
  profit: 5;
}
