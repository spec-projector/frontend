import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { JunteUiModule, ResponsiveModule, ShortcutsModule } from '@junte/ui';
import { LPComponent } from './lp.component';
import { LPRoutingModule } from './lp-routing.module';

@NgModule({
  declarations: [
    LPComponent
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
