import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage {

  constructor(public alertController: AlertController) {}

  async showDeleteAlert() {
    const alert = await this.alertController.create({
      header: 'Warning',
      message: 'This will clear all data stored on your device. Are you sure you want to proceed?',
      buttons: [
        {text: 'OK',
        handler: () => {
          console.log('Confirm Ok: need to call clear method here');
        }}, 
        {text: 'Cancel',
        cssClass: 'modal-button-cancel'}
      ]
    });

    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }

}
