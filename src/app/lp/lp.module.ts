import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  AvatarModule,
  ButtonModule,
  CardModule,
  GridModule, LinkModule,
  LpModule as JntLpModule,
  MenuModule,
  PopoverModule,
  StackModule
} from '@junte/ui';
import { FeaturesComponent } from './features/features.component';
import { LpRoutingModule } from './lp-routing.module';
import { LpComponent } from './lp.component';
import { TariffsModule } from '../subscription/tariffs/tarrifs.module';

@NgModule({
  declarations: [
    LpComponent,
    FeaturesComponent
  ],
  imports: [
    CommonModule,

    LpRoutingModule,

    PopoverModule,
    StackModule,
    CardModule,
    GridModule,
    JntLpModule,
    MenuModule,
    ButtonModule,

    TariffsModule,
    AvatarModule,
    LinkModule
  ]
})
export class LpModule {

}
