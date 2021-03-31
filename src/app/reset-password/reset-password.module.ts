import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  BlockModule,
  ButtonModule,
  FormModule,
  GridModule,
  InformerModule,
  InputModule,
  LinkModule,
  MessageModule,
  ShortcutsModule,
  StackModule
} from '@junte/ui';
import { ResetPasswordRoutingModule } from './reset-password-routing.module';
import { ResetPasswordComponent } from './reset-password.component';
import { SendCodeComponent } from './send-code/send-code.component';
import { SetPasswordComponent } from './set-password/set-password.component';

@NgModule({
  declarations: [
    ResetPasswordComponent,
    SendCodeComponent,
    SetPasswordComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    ResetPasswordRoutingModule,


    ShortcutsModule,
    StackModule,
    GridModule,
    InformerModule,
    BlockModule,
    FormModule,
    InputModule,
    ButtonModule,
    LinkModule,
    MessageModule
  ]
})
export class ResetPasswordModule {

}
