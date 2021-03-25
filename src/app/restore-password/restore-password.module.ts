import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { JunteUiModule, ShortcutsModule } from '@junte/ui';
import { RestorePasswordComponent } from './restore-password.component';
import { RestorePasswordRoutingModule } from './restore-password-routing.module';

@NgModule({
  declarations: [
    RestorePasswordComponent
  ],
  imports: [
    CommonModule,
    JunteUiModule,
    ShortcutsModule,
    ReactiveFormsModule,
    RestorePasswordRoutingModule
  ]
})
export class RestorePasswordModule {
}
