import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedGuard } from '../../guards/aurhorisation';
import { ProjectsComponent } from './projects.component';

export const PROJECTS_BREADCRUMB = $localize`:@@label.projects:Projects`;

const routes: Routes = [
  {
    path: '',
    component: ProjectsComponent,
    data: {breadcrumb: PROJECTS_BREADCRUMB},
    canActivate: [LoggedGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule {

}
