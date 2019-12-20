import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActorsComponent } from 'src/app/components/spec/actors/actors.component';
import { DetailsComponent } from 'src/app/components/spec/details/details.component';
import { EpicsComponent } from 'src/app/components/spec/epics/epics.component';
import { PackagesComponent } from 'src/app/components/spec/packages/packages.component';
import { SpecComponent } from 'src/app/components/spec/spec.component';
import { ProjectResolver, SpecResolver } from 'src/app/components/spec/spec.resolvers';
import { SprintComponent } from 'src/app/components/spec/sprints/sprint/sprint.component';
import { SprintsComponent } from 'src/app/components/spec/sprints/sprints.component';
import { SprintResolver } from 'src/app/components/spec/sprints/sprints.resolver';
import { TermsComponent } from 'src/app/components/spec/terms/terms.component';
import { ValidateComponent } from 'src/app/components/spec/validate/validate.component';

export function getProject(data: any) {
    return data.project.title;
}

export function getSprint(data: any) {
    return data.sprint.title;
}

export const routes: Routes = [
    {
        path: '',
        component: SpecComponent,
        resolve: {
            spec: SpecResolver,
            project: ProjectResolver
        },
        data: {breadcrumb: getProject},
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'details'
            },
            {
                path: 'details',
                component: DetailsComponent,
                data: {breadcrumb: 'General'}
            },
            {
                path: 'sprints',
                data: {breadcrumb: 'Sprints'},
                children: [
                    {
                        path: '',
                        component: SprintsComponent,
                        resolve: {spec: SpecResolver},
                        children: [{
                            path: ':sprint',
                            component: SprintComponent,
                            data: {breadcrumb: getSprint},
                            resolve: {sprint: SprintResolver}
                        }],
                        runGuardsAndResolvers: 'always'
                    }
                ]
            },
            {
                path: 'epics',
                component: EpicsComponent,
                data: {breadcrumb: 'Epics'},
                resolve: {spec: SpecResolver}

            },
            {
                path: 'actors',
                component: ActorsComponent,
                data: {breadcrumb: 'Actors'},
                resolve: {spec: SpecResolver}

            },
            {
                path: 'terms',
                component: TermsComponent,
                data: {breadcrumb: 'Knowledge'},
                resolve: {spec: SpecResolver}

            },
            {
                path: 'packages',
                component: PackagesComponent,
                data: {breadcrumb: 'Model'},
                resolve: {spec: SpecResolver}

            },
            {
                path: 'validate',
                component: ValidateComponent,
                data: {breadcrumb: 'Validate'},
                resolve: {spec: SpecResolver}

            }
        ]

    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SpecRoutingModule {
}
