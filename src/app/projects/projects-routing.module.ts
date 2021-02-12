import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsComponent } from 'src/app/projects/projects.component';
import { AuthorizationGuard } from '../../guards/authorization';


export const PROJECTS_BREADCRUMB = $localize`:@@label.projects:Projects`;

const routes: Routes = [
  {
    path: '',
    component: ProjectsComponent,
    data: {breadcrumb: PROJECTS_BREADCRUMB},
    canActivate: [AuthorizationGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule {
}
