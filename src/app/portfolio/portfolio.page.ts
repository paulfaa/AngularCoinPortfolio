import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Coin } from '@types';
import { CoinServiceComponent } from '../coin.service';
import { CurrencyServiceComponent } from '../currency.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.page.html',
  styleUrls: ['./portfolio.page.scss'],
})
export class PortfolioPage implements OnInit, AfterViewInit {
  
  heldCoins: Coin[];
  htmlName = '';
  footer = '';
  currencySymbol = '';
  
  constructor(public alertController: AlertController,
    private coinService: CoinServiceComponent,
    private currencyService: CurrencyServiceComponent) {}
    
    ngOnInit() {
      this.showEmptyPortfolioAlert();
      this.heldCoins = this.coinService.getAllHeldCoins();
      this.currencySymbol = this.currencyService.getCurrencySymbol();
    }
    
    ngAfterViewInit() {
      console.log("ngAfterViewInit All held coins: ", this.coinService.getAllHeldCoins());
      this.heldCoins = this.coinService.getAllHeldCoins();
      this.currencySymbol = this.currencyService.getCurrencySymbol();
    }

    public callDeleteMethod(coin: Coin){
      this.coinService.removeFromHeldCoins(coin);
    }

    public callGetTotalExpenditure(){
      this.coinService.getTotalExpenditure();
    }

    public displayName(coin: Coin): boolean {
      if (coin.name !== this.htmlName) {
        this.htmlName = coin.name;
        return true;
      } else {
        return false;
      }
    }

    public displayFooter(coin: Coin): boolean {
      if (coin.name !== this.footer) {
        this.footer = coin.name;
        return true;
      } else {
        return false;
      }
    }

    public getIconFromCoinName(coin: Coin): string {
      const filePath = "/assets/icon/";
      //can add check here, if file does not exist, return circle.svg
      if(coin.name != null){
        return filePath + coin.name.toLowerCase() + ".svg"
      }
      else{
        return "";
      }
    }
    
    async showEmptyPortfolioAlert() {
      const alert = await this.alertController.create({
        header: 'Nothing here...',
        message: 'Looks like your portfolio is empty. Click the + symbol below to add something.',
        buttons: [
          {text: 'OK'}
        ]
      });
      if(this.coinService.getAllHeldCoins().length == 0){
        await alert.present();
        let result = await alert.onDidDismiss();
        console.log(result);
      }
    }
}