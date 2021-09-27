import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Coin } from '@types';
import { IonicSelectableComponent } from 'ionic-selectable';
import { CoinServiceComponent } from '../coin.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CoinName } from '../types/coinName.type';

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
    private coinService: CoinServiceComponent,
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
    var json = JSON.parse(JSON.stringify(this.coinForm.controls['name'].value));
    //console.log(json.ticker);
    //console.log('value: ', this.coinForm.controls['amount'].value);

    this.coinService.addToHeldCoins(json.name, json.ticker, this.coinForm.controls['purchasePrice'].value, this.coinForm.controls['amount'].value);
    this.presentToast("Added: " + this.coinForm.controls['amount'].value + " " + json.name + " @ " + this.coinForm.controls['purchasePrice'].value+ " per coin.");
    this.clearAllInputs();

    //console.log(this.coinService.getAllHeldCoins());
  }

  public clearAllInputs(){
    this.coinForm.reset();
  }
}
