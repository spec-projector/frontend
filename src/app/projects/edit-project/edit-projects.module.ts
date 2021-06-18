import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
    ButtonModule,
    FormModule,
    ImageUploaderModule,
    InformerModule,
    InputModule, PictureModule,
    StackModule, SwitcherModule,
    SwitchModule,
    TabsModule
} from '@junte/ui';
import { EditProjectComponent } from './edit-project.component';

@NgModule({
  declarations: [
    EditProjectComponent
  ],
    imports: [
        CommonModule,
        ReactiveFormsModule,

        InformerModule,
        FormModule,
        StackModule,
        TabsModule,
        InputModule,
        ButtonModule,
        SwitchModule,
        ImageUploaderModule,
        PictureModule,
        SwitcherModule,
    ]
})
export class ProjectEditModule {

}
