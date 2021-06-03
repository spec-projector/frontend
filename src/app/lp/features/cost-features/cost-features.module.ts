import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CostFeaturesComponent } from './cost-features.component';
import { LabelModule, StackModule } from '@junte/ui';

@NgModule({
  declarations: [
    CostFeaturesComponent
  ],
  exports: [
    CostFeaturesComponent
  ],
  imports: [
    CommonModule,
    StackModule,
    LabelModule
  ]
})
export class CostFeaturesModule {

}
