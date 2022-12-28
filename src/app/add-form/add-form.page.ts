import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-add-form',
  templateUrl: './add-form.page.html',
  styleUrls: ['./add-form.page.scss'],
})
export class AddFormPage implements OnInit {
  coinNames: CoinName[];
  coin: Coin;

  get name(){
    return this.coinForm.get('name');
  }
  get amount(){  // rename to quantity
    return this.coinForm.get('amount');
  }
  get purchasePrice(){
    return this.coinForm.get('purchasePrice');
  }

  public errorMessages = {
    name: [{type: 'required', message: 'This field is required'}]
  }

  coinForm = this.formBuilder.group({
    name: ['', Validators.required],
    amount: ['', [Validators.required, Validators.min(0.00000001)]],
    purchasePrice: ['', [Validators.required, Validators.min(0.01)]]
  })

  constructor(
    private coinService: CoinService,
    private valueService: ValueService,
    private currencyService: CurrencyService,
    public toastController: ToastController,
    private formBuilder: FormBuilder,
    //private coinName: String
  ) { }

  ngOnInit() {
    this.coinNames = this.coinService.getAllCoinNames();
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
    //const coinName = JSON.parse(JSON.stringify(this.coinForm.controls['name'].value));
    const coinValue = this.valueService.createNewValue(this.coinForm.controls['amount'].value);
    const purchaseDetails = new PurchaseDetails(this.coinForm.controls['purchasePrice'].value, this.currencyService.getCurrencySelected(), moment().toDate());
    const coin = new Coin(coinName, purchaseDetails, this.coinForm.controls['amount'].value, coinValue);
    //also should set coinId here
    
    console.log("Newly created coin:")
    console.log(coin);
    this.coinService.addCoin(coin);
    this.presentToast("Added: " + coin.quantity + " " + coin.name.displayName + " @ " + coin.purchaseDetails.price);
    this.clearAllInputs();

    //this.coinService.addToHeldCoins(coinName, this.coinForm.controls['purchasePrice'].value, this.coinForm.controls['amount'].value);
  }

  public clearAllInputs(){
    this.coinForm.reset();
  }
}
