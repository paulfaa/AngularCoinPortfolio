import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'profitFormat'
})
export class ProfitFormatPipe implements PipeTransform {
    transform(value: number): string{
        if (value > 0) {
            return ('▲ ' + ' ' + String(value));
            //need to add colour="success" to ioncardtitle element
          }
          else if (value < 0) {
            return ('▼ ' + ' ' + String(value));
            //add colour ="danger"
          }
          else{
            return String(value);
          }
    }
}