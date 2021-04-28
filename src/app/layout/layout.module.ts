import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppLayoutModule, AvatarModule, ButtonModule, LinkModule, MenuModule, ModalModule, PopoverModule, StackModule } from '@junte/ui';
import { ArrayPipesModule } from 'src/pipes/array/array-pipes.module';
import { StringPipesModule } from '../../pipes/string/string-pipes.module';
import { ChangePasswordModule } from '../change-password/change-password.module';
import { ChangePersonalDataModule } from '../change-personal-data/change-personal-data.module';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';

@NgModule({
  declarations: [
    LayoutComponent
  ],
    imports: [
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
        ChangePersonalDataModule,
        ChangePasswordModule,

        LayoutRoutingModule,
        ButtonModule,
    ]
})
export class LayoutModule {

}
