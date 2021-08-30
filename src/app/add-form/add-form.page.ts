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
  coinNames: Coin[];
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
    //Coin coinToAdd = new Coin(this.coinForm.controls['name'].value, null);
    //this.coinService.addCoin(new Coin(this.coin.name, this.coin.ticker));
    //this.coinService.addToHeldCoins(this.coinForm.controls['name'].value, "JOE", this.coinForm.controls['value'].value);
    //this.coinService.addToHeldCoins('Beepcoin', "BEP", 5);

    //has to be a cleaner way instead of converting to json
    var json = JSON.parse(JSON.stringify(this.coinForm.controls['name'].value));
    console.log(json.ticker);
    this.coinService.addToHeldCoins('Beepcoin', json.ticker, 5);
    console.log(this.coinService.getAllHeldCoins());
    this.presentToast("Added: " + " amount " + " coinName");
  }

  public clearAllInputs(){
    this.coinForm.reset();
  }
}
