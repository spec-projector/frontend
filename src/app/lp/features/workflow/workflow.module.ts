import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { WorkflowComponent } from './workflow.component';
import { LabelModule, StackModule } from '@junte/ui';

@NgModule({
  declarations: [
    WorkflowComponent
  ],
  exports: [
    WorkflowComponent
  ],
  imports: [
    CommonModule,
    StackModule,
    LabelModule
  ]
})
export class WorkflowModule {

}
