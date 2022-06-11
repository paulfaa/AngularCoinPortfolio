import { AfterViewInit, Component, OnInit, SimpleChanges } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Coin } from '../types/coin.type';
import { CoinService } from '../service/coin.service';
import { CurrencyService } from '../service/currency.service';
import { ValueService } from '../service/value.service';
import { LoggingService } from '../service/logging.service';

//TODO 
// Fix icons on portfolio page
// Connect to backend

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.page.html',
  styleUrls: ['./portfolio.page.scss'],
})
export class PortfolioPage implements OnInit, AfterViewInit {
  
  heldCoins: Coin[];
  htmlName = '';
  footer = '';
  private currencySymbol = '';
  private totalValue = 0;
  private totalProfit = 0;
  
  constructor(public alertController: AlertController,
    private coinService: CoinService,
    private valueService: ValueService,
    private currencyService: CurrencyService,
    private loggingService: LoggingService) {}
    
    ngOnInit() {
      this.heldCoins = this.coinService.getAllHeldCoins();
      this.currencySymbol = this.currencyService.getCurrencySymbol();
      this.totalValue = this.valueService.calculateTotalValue();
      this.totalProfit = this.valueService.calculateTotalProfit();
      this.showEmptyPortfolioAlert();
    }

    ngOnChanges(changes: SimpleChanges) {
      if (changes.heldCoins) {
        console.log("ngOnChanges");
        this.totalValue = this.valueService.calculateTotalValue();
        this.totalProfit = this.valueService.calculateTotalProfit();
      }
    }
    
    ngAfterViewInit() {
      console.log("ngAfterViewInit All held coins: ", this.coinService.getAllHeldCoins());
      
    }

    public callCalculateValueForTicker(ticker: string){
      this.valueService.calculateValueForTicker(ticker);
    }

    public callDeleteMethod(coin: Coin){
      this.coinService.removeFromHeldCoins(coin);
    }

    public displayFooter(coin: Coin): boolean {
      if (coin.name !== this.footer) {
        this.footer = coin.name;
        return true;
      } else {
        return false;
      }
    }

    /* public getIconFromCoinName(coin: Coin): string {
      const filePath = "/assets/icon/";
      var filename;
      this.httpClient.get(filePath + coin.name.toLowerCase() + ".svg").subscribe(() => {
        filename = filePath + coin.name.toLowerCase() + ".svg"
      }, (err) => {
        // HANDLE file not found
        if (err.status === 404) {
          filename = "circle.svg";
        }
      });
      return filename
    } */

    async infoPopup(coin: Coin) {
      const alert = await this.alertController.create({
        header: coin.quantity + " " + coin.name,
        message: coin.purchaseDate.toString() + "<br>" + "\n" + coin.purchasePrice,
        buttons: [
          {text: 'OK'}
        ]
      });
      await alert.present();
      let result = await alert.onDidDismiss();
      console.log(result);
  }
    
    async showEmptyPortfolioAlert() {
      const alert = await this.alertController.create({
        header: 'Nothing here...',
        message: 'Looks like your portfolio is empty. Click the + symbol below to add something.',
        buttons: [
          {text: 'OK'}
        ]
      });
      if(this.coinService.getLengthOfHeldCoins() == 0){
        await alert.present();
        this.loggingService.info("Empty portfolio alert shown");
      }
  }
}