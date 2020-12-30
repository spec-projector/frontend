import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { JunteUiModule } from '@junte/ui';
import { ProjectsRoutingModule } from 'src/app/projects/projects-routing.module';
import { ArrayPipesModule } from 'src/pipes/array/array-pipes.module';
import { EditProjectComponent } from './edit-project/edit-project.component';
import { ProjectsComponent } from './projects.component';

@NgModule({
    declarations: [
        ProjectsComponent,
        EditProjectComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        JunteUiModule,
        ArrayPipesModule,
        ProjectsRoutingModule
    ],
    entryComponents: [EditProjectComponent]
})
export class ProjectsModule {
}