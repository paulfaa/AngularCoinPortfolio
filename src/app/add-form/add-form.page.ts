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

@Component({
  selector: 'app-add-form',
  templateUrl: './add-form.page.html',
  styleUrls: ['./add-form.page.scss'],
})
export class AddFormPage implements OnInit, OnDestroy {

  public coinNames: CryptoName[];
  //can keep all subscriptions in an array
  private paramsSubscription: Subscription;
  private perCoinPurchasePriceSubscription: Subscription;
  private totalPurchasePriceSubscription: Subscription;

  public errorMessages = {
    name: [{type: 'required', message: 'This field is required'}]
  }

  coinForm = this.formBuilder.group({
    name: ['', Validators.required],
    quantity: ['', [Validators.required, Validators.min(0.00000001)]],
    perCoinPurchasePrice: ['', [Validators.min(0.01)]],
    totalPurchasePrice: ['', [Validators.min(0.01)]]
  }, 
    { validator: atLeastOne(Validators.required, ['perCoinPurchasePrice','totalPurchasePrice'])
  });

  constructor(
    private coinService: PurchasesService,
    private valueService: ValueService,
    private currencyService: CurrencyService,
    public toastController: ToastController,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
    //private coinName: String
  ) { }

  ngOnInit() {
    this.coinNames = this.coinService.getAllCryptoNames();
    this.paramsSubscription = this.route.params.subscribe(() => {
      this.coinForm.reset();
    });
    this.perCoinPurchasePriceSubscription = this.createFormChangeSubscription("perCoinPurchasePrice", "totalPurchasePrice");
    this.totalPurchasePriceSubscription = this.createFormChangeSubscription("totalPurchasePrice", "perCoinPurchasePrice");
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
  }

  private createFormChangeSubscription(controlToMonitorName: string, controlToToggleName: string): Subscription {
    const controlToToggle = this.coinForm.get(controlToToggleName);
    return this.coinForm.get(controlToMonitorName).valueChanges.subscribe(inputValue => {
      if(inputValue == null && controlToToggle.disabled == true){
        controlToToggle.enable();
      }
      else if(inputValue != null && controlToToggle.enabled == true){
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

  public submitForm(){
    const coinName = this.coinForm.controls['name'].value;
    const coinQuantity = this.coinForm.controls['quantity'].value;
    const coinValue = this.valueService.createNewValue(coinQuantity);
    const purchaseDetails = this.getPurchaseDetails();
    const coin = new CryptoPurchase(coinName, purchaseDetails, coinQuantity, coinValue);
    //also should set coinId here
    
    console.log("Newly created coin:")
    console.log(coin);
    this.coinService.addPurchase(coin);
    this.presentToast("Added: " + coin.quantity + " " + coin.name.displayName + " @ " + coin.purchaseDetails.price);
    this.clearAllInputs();
  }

  public clearAllInputs(){
    this.coinForm.reset();
  }

  private getPurchaseDetails(): PurchaseDetails{
    const selectedCurrency = this.currencyService.getSelectedCurrency();
    const currentDateTime = moment().toDate();
    var purchasePrice = 0;
    if(this.coinForm.controls['perCoinPurchasePrice'].value != null){
      purchasePrice = this.coinForm.controls['perCoinPurchasePrice'].value;
    }
    else {
      purchasePrice = this.coinForm.controls['totalPurchasePrice'].value / this.coinForm.controls['quantity'].value;
    }
    return new PurchaseDetails(purchasePrice, selectedCurrency, currentDateTime);
  }
}
