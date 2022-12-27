import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule, NavController } from '@ionic/angular';

import { PortfolioPageRoutingModule } from './portfolio-routing.module';

import { PortfolioPage } from './portfolio.page';
import { SharedModule } from '../shared/pipes/shared.module';
import { ValueFooterComponent } from '../value-footer/value-footer.component';
import { ValueHeaderComponent } from '../value-header/value-header.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PortfolioPageRoutingModule,
    SharedModule
  ],
  declarations: [PortfolioPage, ValueFooterComponent, ValueHeaderComponent]
})
export class PortfolioPageModule {
  public navController: NavController;
  //profit: 5;
}
