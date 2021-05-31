import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FeaturesMapComponent } from './features-map.component';
import { LabelModule, StackModule } from '@junte/ui';

@NgModule({
  declarations: [
    FeaturesMapComponent
  ],
  exports: [
    FeaturesMapComponent
  ],
  imports: [
    CommonModule,
    StackModule,
    LabelModule
  ]
})
export class FeaturesMapModule {

}
