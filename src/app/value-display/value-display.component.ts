import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CryptoPurchase } from '../types/cryptoPurchase.type';
import { PurchasesService } from '../service/purchases.service';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'value-display',
  templateUrl: './value-display.component.html',
  styleUrls: ['./value-display.component.scss'],
})
export class ValueDisplayComponent implements OnInit {
  @Input() idInput;
  @Input() currencySymbolInput;

  @Output() deletePurchaseEvent: EventEmitter<CryptoPurchase> = new EventEmitter<CryptoPurchase>();
  @Output() infoPopupEvent: EventEmitter<CryptoPurchase> = new EventEmitter<CryptoPurchase>();

  public purchasesMatchingId$: Observable<CryptoPurchase[]>;
  public totalValue$: Observable<number>;
  public totalProfit$: Observable<number>;
  public profitPercentage$: Observable<number>;
  private expenditure$: Observable<number>;

  constructor(private purchasesService: PurchasesService) {}

  ngOnInit() {
    this.purchasesMatchingId$ = this.purchasesService.getPurchasesById(this.idInput);
    this.totalValue$ = this.purchasesMatchingId$.pipe(
      map(purchases => {
        return purchases.reduce((total, purchase) => total + purchase.value.currentValue, 0);
      })
    )
    this.expenditure$ = this.purchasesMatchingId$.pipe(
      map(purchases => {
        return purchases.reduce((total, purchase) => total + purchase.purchaseDetails.price, 0);
      })
    )
    this.totalProfit$ = combineLatest([this.totalValue$, this.expenditure$]).pipe(
      map(([value1, value2]) => value1 - value2)
    );
    this.profitPercentage$ = combineLatest([this.totalProfit$, this.expenditure$]).pipe(
      map(([value1, value2]) => (value1 / value2) * 100)
    );
  }

  public onDeletePurchase(purchase: CryptoPurchase): void {
    this.deletePurchaseEvent.emit(purchase);
  }

  public onInfoPopup(purchase: CryptoPurchase): void {
    this.infoPopupEvent.emit(purchase);
  }
}
