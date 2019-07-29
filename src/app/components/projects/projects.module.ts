import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormPipesModule } from 'junte-angular';
import { JunteUiModule } from 'junte-ui';
import { ProjectsRoutingModule } from 'src/app/components/projects/projects-routing.module';
import { ArrayPipesModule } from 'src/app/pipes/array-pipes.module';
import { ProjectsServiceProvider } from 'src/app/services/projects/projects.provider';
import { EditProjectComponent } from './edit-project/edit-project.component';
import { ProjectsComponent } from './projects.component';

@NgModule({
    declarations: [
        ProjectsComponent,
        EditProjectComponent
    ],
    imports: [
        CommonModule,
        JunteUiModule,
        ArrayPipesModule,
        ProjectsRoutingModule,
        FormPipesModule
    ],
    entryComponents: [EditProjectComponent],
    providers: [
        ProjectsServiceProvider
    ]
})
export class ProjectsModule {
}
