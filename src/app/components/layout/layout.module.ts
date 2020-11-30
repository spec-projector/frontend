import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { JunteUiModule } from '@junte/ui';
import { ArrayPipesModule } from 'src/app/pipes/array/array-pipes.module';
import { FormPipesModule } from 'src/app/pipes/forms/forms.module';
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
    LayoutRoutingModule,
    FormPipesModule
  ]
})
export class LayoutModule {
}
