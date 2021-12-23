import { AfterViewInit, Component, OnInit, SimpleChanges } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Coin } from '@types';
import { CoinServiceComponent } from '../service/coin.service';
import { CurrencyServiceComponent } from '../service/currency.service';
import { ValueServiceComponent } from '../service/value.service';
import {HttpClient} from '@angular/common/http';

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
    private coinService: CoinServiceComponent,
    private valueService: ValueServiceComponent,
    //private httpClient: HttpClient,
    private currencyService: CurrencyServiceComponent) {}
    
    ngOnInit() {
      this.showEmptyPortfolioAlert();
      this.heldCoins = this.coinService.getAllHeldCoins();
      this.currencySymbol = this.currencyService.getCurrencySymbol();
      this.totalValue = this.valueService.calculateTotalValue();
      this.totalProfit = this.valueService.calculateTotalProfit();
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
      this.heldCoins = this.coinService.getAllHeldCoins();
      this.currencySymbol = this.currencyService.getCurrencySymbol();
    }

    public callCalculateValueForTicker(ticker: string){
      this.valueService.calculateValueForTicker(ticker);
    }

    public callDeleteMethod(coin: Coin){
      this.coinService.removeFromHeldCoins(coin);
    }

    public callGetTotalExpenditure(){
      this.coinService.getTotalExpenditure();
    }

    public displayName(coin: Coin): boolean {
      if (this.htmlName !== coin.name || this.htmlName == undefined) {
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
    
    async showEmptyPortfolioAlert() {
      const alert = await this.alertController.create({
        header: 'Nothing here...',
        message: 'Looks like your portfolio is empty. Click the + symbol below to add something.',
        buttons: [
          {text: 'OK'}
        ]
      });
      //if(this.coinService.getLengthOfAllHeldCoins() == 0){
      if(this.coinService.getAllHeldCoins == null){
        await alert.present();
        let result = await alert.onDidDismiss();
        console.log(result);
      }
    }
}