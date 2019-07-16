import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpaceResolver } from 'src/app/resolvers/space';
import { SprintResolver } from 'src/app/resolvers/sprint';
import { ActorsComponent } from 'src/app/space/actors/actors.component';
import { EpicsComponent } from 'src/app/space/epics/epics.component';
import { PackagesComponent } from 'src/app/space/packages/packages.component';
import { SpaceComponent } from 'src/app/space/space.component';
import { SprintComponent } from 'src/app/space/sprints/sprint/sprint.component';
import { SprintsComponent } from 'src/app/space/sprints/sprints.component';
import { TermsComponent } from 'src/app/space/terms/terms.component';
import { ValidateComponent } from 'src/app/space/validate/validate.component';

export const routes: Routes = [
    {
        path: ':project/:space',
        component: SpaceComponent,
        resolve: {space: SpaceResolver},
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
                        resolve: {space: SpaceResolver},
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
                resolve: {space: SpaceResolver}

            },
            {
                path: 'actors',
                component: ActorsComponent,
                resolve: {space: SpaceResolver}

            },
            {
                path: 'terms',
                component: TermsComponent,
                resolve: {space: SpaceResolver}

            },
            {
                path: 'packages',
                component: PackagesComponent,
                resolve: {space: SpaceResolver}

            },
            {
                path: 'validate',
                component: ValidateComponent,
                resolve: {space: SpaceResolver}

            }
        ]

    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SpaceRoutingModule {
}
