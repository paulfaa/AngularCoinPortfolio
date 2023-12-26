import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { CryptoPurchase } from '../types/cryptoPurchase.type';
import { PurchasesService } from '../service/purchases.service';
import { SettingsService } from '../service/settings.service';
import { ValueService } from '../service/value.service';
import { LoggingService } from '../service/logging.service';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

//TODO 
// Display holdings sorted alphabetically

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.page.html',
  styleUrls: ['./portfolio.page.scss'],
})
export class PortfolioPage implements OnInit, AfterViewInit, OnDestroy {

  private httpErrorSubscription: Subscription;
  private purchasesSubscription: Subscription;

  public purchases$: Observable<CryptoPurchase[]>;
  public totalValue$: Observable<number>;
  public totalProfit$: Observable<number>;
  public profitAsPercentage$: Observable<number>;
  public currencySymbol$: Observable<string>;
  public coinmarketIds$: Observable<number[]>;

  constructor(
    public alertController: AlertController,
    private purchasesService: PurchasesService,
    private valueService: ValueService,
    private settingsService: SettingsService,
    private loggingService: LoggingService) { }

  ngOnInit() {
    this.httpErrorSubscription = this.valueService.httpErrorEvent.subscribe(async () => {
      await this.showConnectivityAlert();
    });
    this.currencySymbol$ = this.settingsService.getSelectedCurrency().pipe(
      map(data => data.symbol)
    );
    this.profitAsPercentage$ = this.valueService.getPercentageProfit();
    this.coinmarketIds$ = this.purchasesService.getUniqueIds().pipe(
      //sort here based on selected sort type
    );
    this.totalValue$ = this.valueService.getTotalValue();
    this.totalProfit$ = this.valueService.getTotalProfit();
    //this.showEmptyPortfolioAlert();
  }

  ngOnDestroy(): void {
    if (this.purchasesSubscription) {
      this.purchasesSubscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    console.log("ngAfterViewInit all purchases: ", this.purchasesService.getAllPurchases());
    this.valueService.calculateTotalProfit();
  }

  public onDeletePurchaseClicked(purchase: CryptoPurchase) {
    console.log("delete clicked for ", purchase)
    this.purchasesService.removePurchase(purchase);
  }

  public async showInfoPopup(purchase: CryptoPurchase) {
    const alert = await this.alertController.create({
      header: purchase.quantity + " " + purchase.name.displayName + " (" + purchase.name.ticker + ")",
      message: "Date added: " + purchase.purchaseDetails.date + "<br>" + "\n Cost: " + purchase.purchaseDetails.price + " " + purchase.purchaseDetails.currency.code,
      buttons: [
        { text: 'OK' }
      ]
    });
    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
    console.log(this.totalValue$)
  }

  /* private async showEmptyPortfolioAlert() {
    const alert = await this.alertController.create({
      header: 'Nothing here...',
      message: 'Looks like your portfolio is empty. Click the + symbol below to add something.',
      buttons: [
        { text: 'OK' }
      ]
    });
    if (this.purchases.length == 0) {
      await alert.present();
      this.loggingService.info("Empty portfolio alert shown");
    }
  } */

  private async showConnectivityAlert() {
    const alert = await this.alertController.create({
      header: 'Error connecting to server',
      message: 'Please check that your device is connected to the internet, or try again later.',
      buttons: [
        { text: 'OK' }
      ]
    });
    await alert.present();
    let result = await alert.onDidDismiss();
  }
}