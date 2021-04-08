import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArrayPipesModule, ButtonModule, CardModule, GridModule, IconModule, LabelModule, StackModule } from '@junte/ui';
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
    LabelModule
  ]
})
export class TariffsModule {

}
