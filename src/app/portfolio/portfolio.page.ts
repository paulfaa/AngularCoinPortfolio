import { AfterViewInit, Component, OnInit, SimpleChanges } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { CryptoPurchase } from '../types/cryptoPurchase.type';
import { PurchasesService } from '../service/purchases.service';
import { CurrencyService } from '../service/currency.service';
import { ValueService } from '../service/value.service';
import { LoggingService } from '../service/logging.service';
import { CurrencyEnum } from '../currencyEnum';

//TODO 
// Set coinId when added to portfolio
// Fix icons on portfolio page
// Connect to backend

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.page.html',
  styleUrls: ['./portfolio.page.scss'],
})
export class PortfolioPage implements OnInit, AfterViewInit {
  
  purchases: CryptoPurchase[];
  htmlName = '';
  footer = '';
  private currencySymbol = '';
  private totalValue = 0;
  private totalProfit = 0;
  
  constructor(public alertController: AlertController,
    private coinService: PurchasesService,
    private valueService: ValueService,
    private currencyService: CurrencyService,
    private loggingService: LoggingService) {}
    
    ngOnInit() {
      this.purchases = this.coinService.getAllPurchases(); //should be a subscription
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
      console.log("ngAfterViewInit all purchases: ", this.coinService.getAllPurchases());
      
    }
    
    public callCalculateValueForTicker(ticker: string){
      this.valueService.calculateValueForTicker(ticker);
    }

    public callDeleteMethod(coin: CryptoPurchase){
      this.coinService.removeFromHeldCoins(coin);
    }

    public displayFooter(coin: CryptoPurchase): boolean {
      if (coin.name.displayName !== this.footer) {
        this.footer = coin.name.displayName;
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

    async infoPopup(coin: CryptoPurchase) {
      const enumIndex = coin.purchaseDetails.currency;
      const alert = await this.alertController.create({
        header: coin.quantity + " " + coin.name.displayName + " (" + coin.name.ticker + ")",
        message: coin.purchaseDetails.date.toString() + "<br>" + "\n" + CurrencyEnum[enumIndex] + coin.purchaseDetails.price,
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