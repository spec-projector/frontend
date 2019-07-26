import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormPipesModule } from 'junte-angular';
import { JunteUiModule } from 'junte-ui';
import { ProjectsRoutingModule } from 'src/app/components/projects/projects-routing.module';
import { ProjectsServiceProvider } from 'src/app/services/projects/projects.provider';
import { ProjectsComponent } from './projects.component';

@NgModule({
    declarations: [
        ProjectsComponent
    ],
    imports: [
        CommonModule,
        JunteUiModule,
        ProjectsRoutingModule,
        FormPipesModule
    ],
    providers: [
        ProjectsServiceProvider
    ]
})
export class ProjectsModule {
}
