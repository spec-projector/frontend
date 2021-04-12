import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
    ArrayPipesModule,
    ButtonModule,
    CardModule, DatePeriodModule,
    GridModule,
    IconModule,
    LabelModule,
    LinkModule,
    MessageModule,
    StackModule
} from '@junte/ui';
import { TariffsComponent } from './tariffs.component';

@NgModule({
  declarations: [
    TariffsComponent
  ],
  exports: [
    TariffsComponent
  ],
    imports: [
        CommonModule,

        GridModule,
        StackModule,
        CardModule,
        IconModule,
        ButtonModule,
        ArrayPipesModule,
        LabelModule,
        MessageModule,
        LinkModule,
        DatePeriodModule
    ]
})
export class TariffsModule {

}
