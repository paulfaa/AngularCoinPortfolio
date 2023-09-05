import { NgModule } from "@angular/core";
import { ProfitFormatPipe } from "./profit-format.pipe";
import { EnumToStringPipe } from "./enum-to-string.pipe";

@NgModule({
    declarations: [ProfitFormatPipe, EnumToStringPipe],
    exports: [ProfitFormatPipe, EnumToStringPipe]
})
export class SharedModule {}