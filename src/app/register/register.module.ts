import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  BlockModule,
  ButtonModule,
  FormModule,
  GridModule, IconModule,
  InformerModule,
  InputModule,
  LinkModule,
  ShortcutsModule,
  StackModule
} from '@junte/ui';
import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register.component';

@NgModule({
  declarations: [
    RegisterComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    RegisterRoutingModule,

    ShortcutsModule,
    StackModule,
    GridModule,
    InformerModule,
    BlockModule,
    FormModule,
    InputModule,
    ButtonModule,
    LinkModule,
    IconModule
  ]
})
export class RegisterModule {

}
