import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppLayoutModule, BreadcrumbsModule, GridModule, MenuModule, ModalModule, PopoverModule } from '@junte/ui';
import { AgreementComponent } from './agreement/agreement.component';
import { ContactsComponent } from './contacts/contacts.component';
import { PolicyComponent } from './policy/policy.component';
import { SecurityComponent } from './security/security.component';
import { SiteRoutingModule } from './site-routing.module';
import { SiteComponent } from './site.component';

@NgModule({
  declarations: [
    SiteComponent,
    AgreementComponent,
    PolicyComponent,
    SecurityComponent,
    ContactsComponent
  ],
  imports: [
    CommonModule,
    CommonModule,

    SiteRoutingModule,

    AppLayoutModule,
    PopoverModule,
    ModalModule,
    MenuModule,
    GridModule,
    BreadcrumbsModule
  ]
})
export class SiteModule {

}
