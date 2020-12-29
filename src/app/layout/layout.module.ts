import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { JunteUiModule } from '@junte/ui';
import { ArrayPipesModule } from 'src/pipes/array/array-pipes.module';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';

@NgModule({
  declarations: [
    LayoutComponent
  ],
  imports: [
    CommonModule,
    CommonModule,
    ReactiveFormsModule,
    JunteUiModule,
    ArrayPipesModule,
    LayoutRoutingModule
  ]
})
export class LayoutModule {
}
