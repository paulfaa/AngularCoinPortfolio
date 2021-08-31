import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Coin } from '@types';
import { CoinServiceComponent } from '../coin.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.page.html',
  styleUrls: ['./portfolio.page.scss'],
})
export class PortfolioPage implements OnInit, AfterViewInit {
  
  coinList: Coin[];
  
  constructor(public alertController: AlertController, 
    //not should another coinservice get initialised
    private coinService: CoinServiceComponent) {}
    
    ngOnInit() {
      this.showEmptyPortfolioAlert();
      this.coinList = this.coinService.getAllHeldCoins();
    }
    
    ngAfterViewInit() {
      this.coinList = this.coinService.getAllHeldCoins();
    }
    
    async showEmptyPortfolioAlert() {
      const alert = await this.alertController.create({
        header: 'Nothing here...',
        message: 'Looks like your portfolio is empty. Click the + symbol below to add something',
        buttons: [
          {text: 'OK'}
        ]
      });
      //need to check here if portfolio is empty before calling
      await alert.present();
      let result = await alert.onDidDismiss();
      console.log(result);
    }
  }
  
  