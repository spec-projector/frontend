import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppLayoutModule, ButtonModule, GridModule } from '@junte/ui';
import { SubscriptionRoutingModule } from 'src/app/subscription/subscription-routing.module';
import { TariffsModule } from './tariffs/tarrifs.module';
import { SubscriptionComponent } from './subscription.component';

@NgModule({
  declarations: [
    SubscriptionComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppLayoutModule,
    GridModule,
    ButtonModule,
    TariffsModule,

    SubscriptionRoutingModule
  ]
})
export class SubscriptionModule {

}
