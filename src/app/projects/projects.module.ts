import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  AppLayoutModule,
  ArrayPipesModule,
  ButtonModule,
  CardModule,
  EmptyModule,
  GridModule, ImageUploaderModule,
  LinkModule,
  MenuModule, PictureModule,
  SkeletonModule,
  StackModule
} from '@junte/ui';
import { ProjectEditModule } from './edit-project/edit-projects.module';
import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component';

@NgModule({
  declarations: [
    ProjectsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ArrayPipesModule,
    AppLayoutModule,
    GridModule,
    ButtonModule,
    StackModule,
    CardModule,
    MenuModule,
    LinkModule,
    SkeletonModule,

    ProjectEditModule,
    ProjectsRoutingModule,
    EmptyModule
  ]
})
export class ProjectsModule {

}
