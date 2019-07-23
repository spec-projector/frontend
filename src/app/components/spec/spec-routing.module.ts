import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ActorsComponent} from 'src/app/components/spec/actors/actors.component';
import {EpicsComponent} from 'src/app/components/spec/epics/epics.component';
import {PackagesComponent} from 'src/app/components/spec/packages/packages.component';
import {SpecComponent} from 'src/app/components/spec/spec.component';
import {SprintComponent} from 'src/app/components/spec/sprints/sprint/sprint.component';
import {SprintsComponent} from 'src/app/components/spec/sprints/sprints.component';
import {TermsComponent} from 'src/app/components/spec/terms/terms.component';
import {ValidateComponent} from 'src/app/components/spec/validate/validate.component';
import {SpecResolver} from 'src/app/resolvers/spec';
import {SprintResolver} from 'src/app/resolvers/sprint';

export const routes: Routes = [
    {
        path: '',
        component: SpecComponent,
        resolve: {space: SpecResolver},
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'sprints'

            },
            {
                path: 'sprints',
                children: [
                    {
                        path: '',
                        component: SprintsComponent,
                        resolve: {space: SpecResolver},
                        children: [{
                            path: ':sprint',
                            component: SprintComponent,
                            resolve: {sprint: SprintResolver}
                        }]
                    }
                ]
            },
            {
                path: 'epics',
                component: EpicsComponent,
                resolve: {space: SpecResolver}

            },
            {
                path: 'actors',
                component: ActorsComponent,
                resolve: {space: SpecResolver}

            },
            {
                path: 'terms',
                component: TermsComponent,
                resolve: {space: SpecResolver}

            },
            {
                path: 'packages',
                component: PackagesComponent,
                resolve: {space: SpecResolver}

            },
            {
                path: 'validate',
                component: ValidateComponent,
                resolve: {space: SpecResolver}

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
