import { Component, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { IonicSelectableModule } from 'ionic-selectable';
import { AddFormPageRoutingModule } from './add-form-routing.module';

import { AddFormPage } from './add-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableModule,
    AddFormPageRoutingModule
  ],
  declarations: [AddFormPage]
})

@Component({
  selector: 'add-form',
  templateUrl: './add-form.page.html'
})
export class AddFormPageModule implements OnInit {

  constructor() {}

  ngOnInit(){}

  clearAllInputs(){

  }
}
