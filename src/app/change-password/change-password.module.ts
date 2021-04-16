import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  ButtonModule,
  FormModule,
  InformerModule,
  InputModule,
  MessageModule,
  StackModule
} from '@junte/ui';
import { ChangePasswordComponent } from './change-password.component';

@NgModule({
  declarations: [
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    StackModule,
    InformerModule,
    FormModule,
    InputModule,
    ButtonModule,
    MessageModule
  ]
})
export class ChangePasswordModule {

}
