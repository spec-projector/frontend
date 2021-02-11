import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { JunteUiModule } from '@junte/ui';
import { ArrayPipesModule } from 'src/pipes/array/array-pipes.module';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { SelectLangComponent } from './select-lang/select-lang.component';

@NgModule({
  declarations: [
    LayoutComponent,
    SelectLangComponent
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
