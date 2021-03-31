import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgreementComponent } from './agreement/agreement.component';
import { ContactsComponent } from './contacts/contacts.component';
import { PolicyComponent } from './policy/policy.component';
import { SecurityComponent } from './security/security.component';
import { SiteComponent } from './site.component';

const routes: Routes = [
  {
    path: '',
    component: SiteComponent,
    children: [
      {
        path: 'agreement',
        component: AgreementComponent
      },
      {
        path: 'policy',
        component: PolicyComponent
      },
      {
        path: 'security',
        component: SecurityComponent
      },
      {
        path: 'contacts',
        component: ContactsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SiteRoutingModule {

}
