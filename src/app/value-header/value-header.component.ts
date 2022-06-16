import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'value-header',
  templateUrl: './value-header.component.html',
  styleUrls: ['./value-header.component.scss'],
})
export class ValueHeaderComponent implements OnInit {
  @Input() totalValue;
  @Input() totalProfit;
  @Input() currencySymbol;

  constructor() { }

  ngOnInit() {
    this.getCssClass();
  }

  public getCssClass(): string{
    var className = "default"
    if(this.totalProfit > 0){
      className = "positive";
    }
    else if(this.totalProfit < 0){
      className = "negative";
    }
    return className;
  }

}
