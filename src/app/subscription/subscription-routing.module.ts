import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubscriptionComponent } from 'src/app/subscription/subscription.component';
import { LoggedGuard } from '../../guards/aurhorisation';
import { TariffResolver } from '../../resolvers/tariff';

export const SUBSCRIPTION_BREADCRUMB = $localize`:@@label.subscription:Subscription`;

const routes: Routes = [
  {
    path: '',
    component: SubscriptionComponent,
    data: {breadcrumb: SUBSCRIPTION_BREADCRUMB},
    resolve: {
      tariff: TariffResolver
    },
    canActivate: [LoggedGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscriptionRoutingModule {

}
