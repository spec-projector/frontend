import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { JunteUiModule } from 'junte-ui';
import { ProjectsRoutingModule } from 'src/app/components/projects/projects-routing.module';
import { ArrayPipesModule } from 'src/app/pipes/array/array-pipes.module';
import { FormPipesModule } from 'src/app/pipes/forms/forms.module';
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
        ProjectsRoutingModule,
        FormPipesModule
    ],
    entryComponents: [EditProjectComponent]
})
export class ProjectsModule {
}
