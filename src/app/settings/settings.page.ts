import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { CoinServiceComponent } from '../coin.service';
import { CurrencyServiceComponent } from '../currency.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage {

  constructor(public alertController: AlertController, private currencyService: CurrencyServiceComponent, private coinService: CoinServiceComponent) {}

  async showDeleteAlert() {
    const alert = await this.alertController.create({
      header: 'Warning',
      message: 'This will clear all data stored on your device. Are you sure you want to proceed?',
      buttons: [
        {text: 'OK',
        handler: () => {
          this.coinService.clearAllHeldCoins();
        }}, 
        {text: 'Cancel',
        cssClass: 'modal-button-cancel'}
      ]
    });

    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }

  public callSetCurrency(value: string){
    this.currencyService.setCurrencySelected(value);
  }

  public callGetCurrency(): string{
    return this.currencyService.getCurrencySelected();
  }
}
