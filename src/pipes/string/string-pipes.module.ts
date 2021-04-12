import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EncodeURIPipe } from './encode-uri';

@NgModule({
  declarations: [
    EncodeURIPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    EncodeURIPipe
  ]
})
export class StringPipesModule {

}
