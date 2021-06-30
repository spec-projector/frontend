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
import { ContractComponent } from './features/contract/contract.component';
import { CostFeaturesComponent } from './features/cost-features/cost-features.component';
import { DesignComponent } from './features/design/design.component';
import { FeaturesMapComponent } from './features/features-map/features-map.component';
import { TasksDescriptionComponent } from './features/tasks-description/tasks-description.component';
import { UserStoriesComponent } from './features/user-stories/user-stories.component';
import { WorkflowComponent } from './features/workflow/workflow.component';

@NgModule({
  declarations: [
    LpComponent,
    FeaturesComponent,
    ReviewsComponent,
    CookieAgreementComponent,
    ContractComponent,
    CostFeaturesComponent,
    DesignComponent,
    FeaturesMapComponent,
    TasksDescriptionComponent,
    UserStoriesComponent,
    WorkflowComponent
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
    ResponsiveModule,
  ]
})
export class LpModule {

}
