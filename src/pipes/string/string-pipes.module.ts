import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LocalizePagePipe } from './location';

@NgModule({
  declarations: [
    LocalizePagePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LocalizePagePipe
  ]
})
export class StringPipesModule {

}
