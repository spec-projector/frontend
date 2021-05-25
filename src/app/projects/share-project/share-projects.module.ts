import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  AccordionModule, AvatarModule,
  ButtonModule, CheckboxModule,
  FormModule,
  InformerModule,
  InputModule, SelectModule,
  StackModule,
  SwitcherModule,
  SwitchModule,
  TabsModule
} from '@junte/ui';
import { AddMemberComponent } from './add-member/add-member.component';
import { ShareProjectComponent } from './share-project.component';

@NgModule({
  declarations: [
    AddMemberComponent,
    ShareProjectComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    InformerModule,
    AccordionModule,
    FormModule,
    StackModule,
    TabsModule,
    InputModule,
    ButtonModule,
    SwitchModule,
    SwitcherModule,
    CheckboxModule,
    AvatarModule,
    SelectModule
  ]
})
export class ProjectShareModule {

}
