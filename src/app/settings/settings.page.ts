import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { CurrencyEnum, enumToString } from '../currencyEnum';
import { PurchasesService } from '../service/purchases.service';
import { CurrencyService } from '../service/currency.service';
import { RateService } from '../service/rate.service';
import { ValueService } from '../service/value.service';
import StorageUtils from '../storage.utils';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnDestroy {

  public ratesLastUpdateDate$: Observable<Date>;
  private selectedCurrencySubscription: Subscription;
  public currencyString: string;
  public observable: Observable<CurrencyEnum>;

  constructor(public alertController: AlertController,
              private currencyService: CurrencyService,
              private coinService: PurchasesService,
              private valueService: ValueService,
              private rateService: RateService
  ){}

  ngOnInit() {
    this.ratesLastUpdateDate$ = this.rateService.getRatesLastUpdateDate();
    this.selectedCurrencySubscription = this.currencyService.getSelectedCurrency()
    .subscribe(data => this.currencyString = enumToString(data));
    this.observable = this.currencyService.getSelectedCurrency();
  }

  ngOnDestroy(): void {
    if(this.selectedCurrencySubscription){
      this.selectedCurrencySubscription.unsubscribe();
    }
  }

  public async showDeleteAlert() {
    const alert = await this.alertController.create({
      header: 'Warning',
      message: 'This will clear all data stored on your device. Are you sure you want to proceed?',
      buttons: [
        {text: 'OK',
        handler: () => {
          this.confirmDeleteAlert();
        }}, 
        {text: 'Cancel',
        cssClass: 'modal-button-cancel'}
      ]
    });
    await alert.present();
    let result = await alert.onDidDismiss();
  }

  private async confirmDeleteAlert() {
    const alert = await this.alertController.create({
      header: 'Warning',
      message: 'Are you really sure? This cannot be undone.',
      buttons: [
        {text: 'OK',
        handler: () => {
          this.coinService.clearAllPurchases();
          console.log("call delete all coins")
        }}, 
        {text: 'Cancel',
        cssClass: 'modal-button-cancel'}
      ]
    });
    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }

  public convertToCSV(): string {
    var data = this.coinService.getAllPurchases();
    if (data == null){
      console.log("no data to convert")
      return
    }
    var headerList: string[] = ['name', 'ticker', 'searchString', 'purchasePrice', 'quantity', 'purchaseDate'];
    let array = typeof data != 'object' ? JSON.parse(data) : data;
    let str = '';
    let row = 'S.No,';

    for (let index in headerList) {
        row += headerList[index] + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
        let line = (i+1)+'';
        for (let index in headerList) {
           let head = headerList[index];

            line += ',' + array[i][head];
        }
        str += line + '\r\n';
    }
    console.log(str);
    // need to save this to users device
    return str;
}

  public updateSelectedCurrency(value: CurrencyEnum){
    this.currencyService.setSelectedCurrency(value.toString());
  }

}
