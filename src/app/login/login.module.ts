import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { JunteUiModule, ShortcutsModule } from '@junte/ui';
import { LoginRoutingModule } from 'src/app/login/login-routing.module';
import { LoginComponent } from 'src/app/login/login.component';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    JunteUiModule,
    ShortcutsModule,
    ReactiveFormsModule,
    LoginRoutingModule
  ]
})
export class LoginModule {
}
