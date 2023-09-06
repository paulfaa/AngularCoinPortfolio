import { AfterViewInit, Component, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { CryptoPurchase } from '../types/cryptoPurchase.type';
import { PurchasesService } from '../service/purchases.service';
import { CurrencyService } from '../service/currency.service';
import { ValueService } from '../service/value.service';
import { LoggingService } from '../service/logging.service';
import { CurrencyEnum } from '../types/currencyEnum';
import { Observable, Subscription, of } from 'rxjs';
import { map } from 'rxjs/operators';

//TODO 
// Set coinId when added to portfolio
// Fix icons on portfolio page
// Connect to backend

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.page.html',
  styleUrls: ['./portfolio.page.scss'],
})
export class PortfolioPage implements OnInit, AfterViewInit, OnDestroy {
  
  purchases: CryptoPurchase[];
  htmlName = '';
  footer = '';
  private purchasesSubscription: Subscription;
  public totalValue$: Observable<number>;
  public totalProfit$: Observable<number>;
  public currencySymbol$: Observable<string>;
  
  constructor(public alertController: AlertController,
    private purchasesService: PurchasesService,
    private valueService: ValueService,
    private currencyService: CurrencyService,
    private loggingService: LoggingService){}
    
    ngOnInit() {
      this.purchasesSubscription = this.purchasesService.getAllPurchases().subscribe(purchases => {this.purchases = purchases});
      this.totalValue$ = this.valueService.getTotalValue();
      this.totalProfit$ = this.valueService.getTotalProfit();
      this.currencySymbol$ = this.currencyService.getSelectedCurrency();
      //if purchases is not empty...
      this.showEmptyPortfolioAlert();
      this.valueService.calculateTotalProfit();
    }

    ngOnDestroy(): void {
      if (this.purchasesSubscription) {
        this.purchasesSubscription.unsubscribe();
      }
    }

    /* ngOnChanges(changes: SimpleChanges) {
      if (changes.heldCoins) {
        console.log("ngOnChanges");
        this.totalValue = this.valueService.calculateTotalValue();
        this.totalProfit = this.valueService.calculateTotalProfit();
      }
    } */
    
    ngAfterViewInit() {
      console.log("ngAfterViewInit all purchases: ", this.purchasesService.getAllPurchases());
      
    }
    
    //use event listeners instead
    public callCalculateValueForTicker(ticker: string){
      this.valueService.calculateValueForTicker(ticker);
    }

    public onDeletePurchaseClicked(purchase: CryptoPurchase){
      this.purchasesService.removeFromHeldCoins(purchase);
    }

    public displayFooter(purchase: CryptoPurchase): boolean {
      if (purchase.name.displayName !== this.footer) {
        this.footer = purchase.name.displayName;
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

    public async infoPopup(coin: CryptoPurchase) {
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
      console.log(this.totalValue$)
  }
    
    private async showEmptyPortfolioAlert() {
      const alert = await this.alertController.create({
        header: 'Nothing here...',
        message: 'Looks like your portfolio is empty. Click the + symbol below to add something.',
        buttons: [
          {text: 'OK'}
        ]
      });
      if(this.purchasesService.getLengthOfHeldCoins() == 0){
        await alert.present();
        this.loggingService.info("Empty portfolio alert shown");
      }
  }
}