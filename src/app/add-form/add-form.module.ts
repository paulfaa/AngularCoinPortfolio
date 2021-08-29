import { Component, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { IonicSelectableModule } from 'ionic-selectable';
import { AddFormPageRoutingModule } from './add-form-routing.module';

import { AddFormPage } from './add-form.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    IonicSelectableModule,
    AddFormPageRoutingModule,
  ],
  declarations: [AddFormPage]
})

export class AddFormPageModule{
}
