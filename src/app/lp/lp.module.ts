import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { JunteUiModule, ResponsiveModule, ShortcutsModule } from '@junte/ui';
import { LpComponent } from './lp.component';
import { LPRoutingModule } from './lp-routing.module';

@NgModule({
  declarations: [
    LpComponent
  ],
  imports: [
    CommonModule,
    JunteUiModule,
    ShortcutsModule,
    ReactiveFormsModule,
    LPRoutingModule,
    ResponsiveModule
  ]
})
export class LPModule {
}
