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
    this.applyCss(this.totalProfit);
  }

  public applyCss(totalProfit): string{
    var className = "default"
    if(totalProfit>0){
      className = "positive";
    }
    else{
      className = "negative";
    }
    return className;
  }

}
