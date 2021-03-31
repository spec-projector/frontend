import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { JunteUiModule, ResponsiveModule, ShortcutsModule } from '@junte/ui';
import { LpComponent } from './lp.component';
import { LpRoutingModule } from './lp-routing.module';

@NgModule({
  declarations: [
    LpComponent
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
