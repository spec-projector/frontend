import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppLayoutModule, AvatarModule, LinkModule, MenuModule, ModalModule, PopoverModule, StackModule } from '@junte/ui';
import { ArrayPipesModule } from 'src/pipes/array/array-pipes.module';
import { StringPipesModule } from '../../pipes/string/string-pipes.module';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { ChangePasswordModule } from '../change-password/change-password.module';
import { ChangePersonalDataModule } from '../change-personal-data/change-personal-data.module';

@NgModule({
  declarations: [
    LayoutComponent
  ],
  imports: [
    CommonModule,
    ChangePasswordModule,

    MenuModule,
    AppLayoutModule,
    LinkModule,
    StackModule,
    AvatarModule,
    PopoverModule,
    ModalModule,
    ArrayPipesModule,
    StringPipesModule,

    LayoutRoutingModule,
    ChangePersonalDataModule
  ]
})
export class LayoutModule {

}
