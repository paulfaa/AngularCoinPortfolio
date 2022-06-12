import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { CoinService } from '../service/coin.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CoinName } from '../types/coinName.type';
import { Coin } from '../types/coin.type';
import { Value } from '../types/value.type';
import { ValueService } from '../service/value.service';

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
  get amount(){
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
    //has to be a cleaner way instead of converting to json
    var coinName = JSON.parse(JSON.stringify(this.coinForm.controls['name'].value));
    var coinValue = this.valueService.createNewValue(this.coinForm.controls['amount'].value);
    var coin = new Coin(coinName, this.coinForm.controls['purchasePrice'].value, this.coinForm.controls['amount'].value);
    
    console.log("Newly created coin:")
    console.log(coin);
    this.coinService.addCoin(coin);
    this.presentToast("Added: " + coin.quantity + " " + coin.name.displayName + " @ " + coin.purchasePrice);
    this.clearAllInputs();

    //this.coinService.addToHeldCoins(coinName, this.coinForm.controls['purchasePrice'].value, this.coinForm.controls['amount'].value);
  }

  public clearAllInputs(){
    this.coinForm.reset();
  }
}
