import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Coin } from '@types';
import { IonicSelectableComponent } from 'ionic-selectable';
import { CoinServiceComponent } from '../coin.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-add-form',
  templateUrl: './add-form.page.html',
  styleUrls: ['./add-form.page.scss'],
})
export class AddFormPage implements OnInit {
  coins: Coin[];
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
    amount: ['', Validators.required],
    purchasePrice: ['', Validators.required]
  })

  constructor(
    private coinService: CoinServiceComponent,
    public toastController: ToastController,
    private formBuilder: FormBuilder,
    private coinName: string
  ) { }

  ngOnInit() {
    this.coins = this.coinService.getAllCoinNames();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'You added ...',
      duration: 2000
    });
    toast.present();
  }

  coinChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    console.log('coin:', event.value);
    //this.coinName = event as HTMLElement
  }

  public submitForm(){
    //Coin coinToAdd = new Coin(this.coinForm.controls['name'].value, null);
    //this.coinService.addCoin(new Coin(this.coin.name, this.coin.ticker));
    this.coinService.addToHeldCoins(this.coinForm.controls['name'].value, "JOE", this.coinForm.controls['value'].value);
    //console.log(this.coinForm.value);
    console.log(this.coinService.getAllHeldCoins());
    this.presentToast();
  }

}
