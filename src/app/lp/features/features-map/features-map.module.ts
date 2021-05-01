import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FeaturesMapComponent } from './features-map.component';
import { LabelModule, StackModule } from '@junte/ui';
import { ClientComponent } from './client/client.component';
import { ManagerComponent } from './manager/manager.component';
import { CurrierComponent } from './currier/currier.component';

@NgModule({
  declarations: [
    FeaturesMapComponent,
    ClientComponent,
    ManagerComponent,
    CurrierComponent
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
