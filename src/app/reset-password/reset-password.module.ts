import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { JunteUiModule, ShortcutsModule } from '@junte/ui';
import { ResetPasswordComponent } from './reset-password.component';
import { ResetPasswordRoutingModule } from './reset-password-routing.module';
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

    JunteUiModule,
    ShortcutsModule,
  ]
})
export class ResetPasswordModule {

}
