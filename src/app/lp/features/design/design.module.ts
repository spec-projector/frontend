import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DesignComponent } from './design.component';
import { LabelModule, StackModule } from '@junte/ui';

@NgModule({
  declarations: [
    DesignComponent
  ],
  exports: [
    DesignComponent
  ],
  imports: [
    CommonModule,
    StackModule,
    LabelModule
  ]
})
export class DesignModule {

}
