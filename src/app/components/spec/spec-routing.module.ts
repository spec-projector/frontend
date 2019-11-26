import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActorsComponent } from 'src/app/components/spec/actors/actors.component';
import { DetailsComponent } from 'src/app/components/spec/details/details.component';
import { EpicsComponent } from 'src/app/components/spec/epics/epics.component';
import { PackagesComponent } from 'src/app/components/spec/packages/packages.component';
import { SpecComponent } from 'src/app/components/spec/spec.component';
import { SpecResolver } from 'src/app/components/spec/spec.resolver';
import { SprintComponent } from 'src/app/components/spec/sprints/sprint/sprint.component';
import { SprintsComponent } from 'src/app/components/spec/sprints/sprints.component';
import { SprintResolver } from 'src/app/components/spec/sprints/sprints.resolver';
import { TermsComponent } from 'src/app/components/spec/terms/terms.component';
import { ValidateComponent } from 'src/app/components/spec/validate/validate.component';

export const routes: Routes = [
    {
        path: '',
        component: SpecComponent,
        resolve: {spec: SpecResolver},
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'sprints'

            },
            {
                path: 'details',
                component: DetailsComponent
            },
            {
                path: 'sprints',
                children: [
                    {
                        path: '',
                        component: SprintsComponent,
                        resolve: {spec: SpecResolver},
                        children: [{
                            path: ':sprint',
                            component: SprintComponent,
                            resolve: {sprint: SprintResolver}
                        }],
                        runGuardsAndResolvers: 'always'
                    }
                ]
            },
            {
                path: 'epics',
                component: EpicsComponent,
                resolve: {spec: SpecResolver}

            },
            {
                path: 'actors',
                component: ActorsComponent,
                resolve: {spec: SpecResolver}

            },
            {
                path: 'terms',
                component: TermsComponent,
                resolve: {spec: SpecResolver}

            },
            {
                path: 'packages',
                component: PackagesComponent,
                resolve: {spec: SpecResolver}

            },
            {
                path: 'validate',
                component: ValidateComponent,
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
