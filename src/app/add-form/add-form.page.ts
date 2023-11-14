import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { PurchasesService } from '../service/purchases.service';
import { Validators, FormBuilder } from '@angular/forms';
import { CryptoName } from '../types/cryptoName.type';
import { CryptoPurchase } from '../types/cryptoPurchase.type';
import { ValueService } from '../service/value.service';
import { PurchaseDetails } from '../types/purchaseDetails.type';
import { CurrencyService } from '../service/currency.service';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { atLeastOne } from '../shared/directives/at-least-one-validator.directive';
import { CurrencyEnum } from '../types/currencyEnum';
import { cryptoNames, cryptoNamesMap } from '../shared/constants/constants';

@Component({
  selector: 'app-add-form',
  templateUrl: './add-form.page.html',
  styleUrls: ['./add-form.page.scss'],
})
export class AddFormPage implements OnInit, OnDestroy {

  public coinNames = cryptoNames;
  //public coinNames = Array.from(cryptoNamesMap.values());;
  //can keep all subscriptions in an array
  private paramsSubscription: Subscription;
  private perCoinPurchasePriceSubscription: Subscription;
  private totalPurchasePriceSubscription: Subscription;
  private currencySubscription: Subscription;
  private selectedCurrency: CurrencyEnum;

  public errorMessages = {
    name: [{ type: 'required', message: 'This field is required' }]
  }

  cryptoForm = this.formBuilder.group({
    name: ['', Validators.required],
    quantity: ['', [Validators.required, Validators.min(0.00000001)]],
    perCoinPurchasePrice: ['', [Validators.min(0.01)]],
    totalPurchasePrice: ['', [Validators.min(0.01)]]
  },
    {
      validator: atLeastOne(Validators.required, ['perCoinPurchasePrice', 'totalPurchasePrice'])
    });

  constructor(
    private purchasesService: PurchasesService,
    private valueService: ValueService,
    private currencyService: CurrencyService,
    public toastController: ToastController,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
    //private coinName: String
  ) { }

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe(() => {
      this.cryptoForm.reset();
    });
    this.perCoinPurchasePriceSubscription = this.createFormChangeSubscription("perCoinPurchasePrice", "totalPurchasePrice");
    this.totalPurchasePriceSubscription = this.createFormChangeSubscription("totalPurchasePrice", "perCoinPurchasePrice");
    this.currencySubscription = this.currencyService.getSelectedCurrency().subscribe(value => { this.selectedCurrency = value });
  }

  ngOnDestroy(): void {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.perCoinPurchasePriceSubscription) {
      this.perCoinPurchasePriceSubscription.unsubscribe();
    }
    if (this.totalPurchasePriceSubscription) {
      this.totalPurchasePriceSubscription.unsubscribe();
    }
    if (this.currencySubscription) {
      this.currencySubscription.unsubscribe();
    }
  }

  private createFormChangeSubscription(controlToMonitorName: string, controlToToggleName: string): Subscription {
    const controlToToggle = this.cryptoForm.get(controlToToggleName);
    return this.cryptoForm.get(controlToMonitorName).valueChanges.subscribe(inputValue => {
      if (inputValue == null && controlToToggle.disabled == true) {
        controlToToggle.enable();
      }
      else if (inputValue != null && controlToToggle.enabled == true) {
        controlToToggle.disable();
      }
    })
  }

  private async presentToast(toastContent: string) {
    const toast = await this.toastController.create({
      message: toastContent,
      duration: 2000
    });
    toast.present();
  }

  coinChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    console.log('eventValue:', event.value);
    //this.coinName = event as HTMLElement
  }

  public submitForm() {
    const coinName: CryptoName = this.cryptoForm.controls['name'].value;
    const coinQuantity = this.cryptoForm.controls['quantity'].value;
    const coinValue = this.valueService.createNewValue(coinQuantity, this.selectedCurrency);
    const purchaseDetails = this.getPurchaseDetails();
    const purchase = new CryptoPurchase(coinName, purchaseDetails, coinQuantity, coinValue);

    console.log("Newly created purchase: ", purchase)
    this.purchasesService.addPurchase(purchase);
    //need to move toast position
    //this.presentToast("Added: " + coin.quantity + " " + coin.name.displayName + " @ " + this.selectedCurrency + coin.purchaseDetails.price);
    this.clearAllInputs();
  }

  public clearAllInputs() {
    this.cryptoForm.reset();
  }

  private getPurchaseDetails(): PurchaseDetails {
    const currentDateTime = moment().toDate();
    var purchasePrice = 0;
    if (this.cryptoForm.controls['perCoinPurchasePrice'].value != null) {
      purchasePrice = this.cryptoForm.controls['perCoinPurchasePrice'].value;
    }
    else {
      purchasePrice = this.cryptoForm.controls['totalPurchasePrice'].value / this.cryptoForm.controls['quantity'].value;
    }
    return new PurchaseDetails(purchasePrice, this.selectedCurrency, currentDateTime);
  }
}
