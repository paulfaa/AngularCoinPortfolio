import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'profitFormat'
})
export class ProfitFormatPipe implements PipeTransform {
    transform(value: number, ...args: any[]){
        if (value > 0) {
            return ('▲ ' + String(value))
            //need to add colour="success" to ioncardtitle element
          }
          else if (value < 0) {
            return ('▼ ' + String(value))
            //add colour ="danger"
          }
    }
}