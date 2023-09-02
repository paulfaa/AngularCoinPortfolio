import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { CoinService } from '../service/coin.service';
import { Validators, FormBuilder } from '@angular/forms';
import { CoinName } from '../types/coinName.type';
import { Coin } from '../types/coin.type';
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

  private coinNames: CoinName[];
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
    private coinService: CoinService,
    private valueService: ValueService,
    private currencyService: CurrencyService,
    public toastController: ToastController,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
    //private coinName: String
  ) { }

  ngOnInit() {
    this.coinNames = this.coinService.getAllCoinNames();
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

  async presentToast(toastContent: string) {
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
    const coin = new Coin(coinName, purchaseDetails, coinQuantity, coinValue);
    //also should set coinId here
    
    console.log("Newly created coin:")
    console.log(coin);
    this.coinService.addCoin(coin);
    this.presentToast("Added: " + coin.quantity + " " + coin.name.displayName + " @ " + coin.purchaseDetails.price);
    this.clearAllInputs();
  }

  public clearAllInputs(){
    this.coinForm.reset();
  }

  private getPurchaseDetails(): PurchaseDetails{
    const selectedCurrency = this.currencyService.getCurrencySelected();
    const currentDateTime = moment().toDate();
    var purchasePrice = 0;
    if(this.coinForm.controls['perCoinPurchasePrice'].value != null){
      purchasePrice = this.coinForm.controls['perCoinPurchasePrice'].value;
    }
    else if(this.coinForm.controls['totalPurchasePrice'].value != null){
      purchasePrice = this.coinForm.controls['totalPurchasePrice'].value / this.coinForm.controls['quantity'].value;
    }
    //ensure method can only be called if input fields valid, otherwise need validation here
    return new PurchaseDetails(purchasePrice, selectedCurrency, currentDateTime);
  }
}
