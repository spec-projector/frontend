import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { JunteUiModule, ResponsiveModule, ShortcutsModule } from '@junte/ui';
import { LpComponent } from './lp.component';
import { LpRoutingModule } from './lp-routing.module';
import { TariffsComponent } from './tariffs/tariffs.component';
import { FeaturesComponent } from './features/features.component';

@NgModule({
  declarations: [
    LpComponent,
    TariffsComponent,
    FeaturesComponent
  ],
  imports: [
    CommonModule,

    LpRoutingModule,

    JunteUiModule,
    ShortcutsModule,
    ReactiveFormsModule,
    ResponsiveModule
  ]
})
export class LpModule {

}
