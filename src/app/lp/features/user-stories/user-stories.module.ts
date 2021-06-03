import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UserStoriesComponent } from './user-stories.component';
import { LabelModule, StackModule } from '@junte/ui';

@NgModule({
  declarations: [
    UserStoriesComponent
  ],
  exports: [
    UserStoriesComponent
  ],
  imports: [
    CommonModule,
    StackModule,
    LabelModule
  ]
})
export class UserStoriesModule {

}
