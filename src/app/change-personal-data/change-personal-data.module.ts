import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  AvatarModule,
  ButtonModule,
  FormModule, ImageUploaderModule,
  InformerModule,
  InputModule,
  MessageModule,
  StackModule
} from '@junte/ui';
import { ChangePersonalDataComponent } from './change-personal-data.component';

@NgModule({
  declarations: [
    ChangePersonalDataComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    StackModule,
    InformerModule,
    FormModule,
    InputModule,
    ButtonModule,
    MessageModule,
    ImageUploaderModule,
    AvatarModule
  ]
})
export class ChangePersonalDataModule {

}
