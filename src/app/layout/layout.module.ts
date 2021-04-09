import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppLayoutModule, AvatarModule, LinkModule, MenuModule, ModalModule, PopoverModule, StackModule } from '@junte/ui';
import { ArrayPipesModule } from 'src/pipes/array/array-pipes.module';
import { StringPipesModule } from '../../pipes/string/string-pipes.module';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';

@NgModule({
  declarations: [
    LayoutComponent
  ],
  imports: [
    CommonModule,
    CommonModule,

    MenuModule,
    AppLayoutModule,
    LinkModule,
    StackModule,
    AvatarModule,
    PopoverModule,
    ModalModule,
    ArrayPipesModule,
    StringPipesModule,

    LayoutRoutingModule
  ]
})
export class LayoutModule {

}
