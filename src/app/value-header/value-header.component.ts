import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'value-header',
  templateUrl: './value-header.component.html',
  styleUrls: ['./value-header.component.scss'],
})
export class ValueHeaderComponent {
  @Input() totalValue$: Observable<number>;
  @Input() totalProfit$: Observable<number>;
  @Input() profitAsPercentage$: Observable<number>;
  @Input() currencySymbol$: Observable<string>;
}