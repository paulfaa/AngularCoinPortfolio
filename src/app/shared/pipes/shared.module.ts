import { NgModule } from "@angular/core";
import { ProfitFormatPipe } from "./profit-format.pipe";

@NgModule({
    declarations: [ProfitFormatPipe],
    exports: [ProfitFormatPipe]
})
export class SharedModule {}