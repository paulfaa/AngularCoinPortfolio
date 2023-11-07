import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CryptoPurchase } from '../types/cryptoPurchase.type';
import { PurchasesService } from '../service/purchases.service';
import { Observable } from 'rxjs';

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

  constructor(private purchasesService: PurchasesService) {}

  ngOnInit() {
    this.purchasesMatchingId$ = this.purchasesService.getPurchasesById(this.idInput);
  }

  public onDeletePurchase(purchase: CryptoPurchase): void {
    this.deletePurchaseEvent.emit(purchase);
  }

  public onInfoPopup(purchase: CryptoPurchase): void {
    this.infoPopupEvent.emit(purchase);
  }

}
