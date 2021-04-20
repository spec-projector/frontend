import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  AvatarModule,
  ButtonModule,
  CardModule, CollapsibleModule,
  GridModule, IconModule, LinkModule,
  LpModule as JntLpModule,
  MenuModule,
  PopoverModule,
  ResponsiveModule,
  StackModule
} from '@junte/ui';
import { FeaturesComponent } from './features/features.component';
import { LpRoutingModule } from './lp-routing.module';
import { LpComponent } from './lp.component';
import { TariffsModule } from '../subscription/tariffs/tarrifs.module';
import { CookieAgreementComponent } from './cookie/cookie-agreement.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { ViewportDirective, ViewportRuleDirective } from './viewport/viewport.directive';

@NgModule({
  declarations: [
    LpComponent,
    FeaturesComponent,
    ReviewsComponent,
    CookieAgreementComponent,
    ViewportRuleDirective,
    ViewportDirective
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
    LinkModule,
    IconModule,
    CollapsibleModule,
    ResponsiveModule
  ]
})
export class LpModule {

}
