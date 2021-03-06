import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  AppLayoutModule,
  BreadcrumbsModule,
  GridModule, IconModule,
  LinkModule,
  MenuModule,
  MessageModule,
  ModalModule,
  PopoverModule, StackModule, TimelineModule
} from '@junte/ui';
import { AgreementComponent } from './agreement/agreement.component';
import { ContactsComponent } from './contacts/contacts.component';
import { PolicyComponent } from './policy/policy.component';
import { RecurrentComponent } from './recurrent/recurrent.component';
import { SecurityComponent } from './security/security.component';
import { SiteRoutingModule } from './site-routing.module';
import { SiteComponent } from './site.component';
import { SupportComponent } from './support/support.component';

@NgModule({
  declarations: [
    SiteComponent,
    AgreementComponent,
    RecurrentComponent,
    PolicyComponent,
    SecurityComponent,
    ContactsComponent,
    SupportComponent
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
    BreadcrumbsModule,
    LinkModule,
    MessageModule,
    StackModule,
    TimelineModule,
    IconModule
  ]
})
export class SiteModule {

}
