import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormPipesModule } from 'junte-angular';
import { JunteUiModule } from 'junte-ui';
import { ProjectsRoutingModule } from 'src/app/components/projects/projects-routing.module';
import { ProjectResolver } from 'src/app/components/projects/projects.resolver';
import { ProjectsServiceProvider } from 'src/app/services/projects/projects.provider';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { ProjectsComponent } from './projects.component';

@NgModule({
    declarations: [
        ProjectsComponent,
        ProjectDetailComponent
    ],
    imports: [
        CommonModule,
        JunteUiModule,
        ProjectsRoutingModule,
        FormPipesModule
    ],
    providers: [
        ProjectsServiceProvider,
        ProjectResolver
    ]
})
export class ProjectsModule {
}
