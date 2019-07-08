import {NgModule} from '@angular/core';
import {SpaceComponent} from './space.component';
import {JunteUiModule} from 'junte-ui';
import {AnchorPipe} from 'pipes/anchor';
import {LabelPipe} from 'pipes/label';
import {RouterModule} from '@angular/router';
import {SprintsComponent} from '../space/sprints/sprints.component';
import {EpicsComponent} from '../space/epics/epics.component';
import {ActorsComponent} from '../space/actors/actors.component';
import {TermsComponent} from '../space/terms/terms.component';
import {ValidateComponent} from '../space/validate/validate.component';
import {GroupFeaturesByActorPipe, GroupFeaturesByEpicPipe} from '../pipes/group-features';
import {FeatureComponent} from '../space/feature/feature.component';
import {TokensComponent} from '../space/tokens/tokens.component';
import {IssueComponent} from '../space/issue/issue.component';
import {FramesStorage} from '../services/frames-storage.service';
import {SprintComponent} from '../space/sprint/sprint.component';
import {SprintResolver} from '../resolvers/sprint';
import {ClipboardService} from 'ngx-clipboard';
import {EntityComponent} from '../space/entity/entity.component';
import {PackagesComponent} from '../space/packages/packages.component';
import {TermComponent} from '../space/term/term.component';
import {ReactiveFormsModule} from '@angular/forms';
import {TokenTypePipe} from '../pipes/token-type';
import {ClickOutsideModule} from 'ng4-click-outside';
import {FeatureTermsPipe} from '../pipes/feature-terms';
import {PackageComponent} from '../space/package/package.component';
import {FitWidthDirective} from '../../directives/fit-width.directive';
import {DndModule} from 'ngx-drag-drop';
import {EntityFieldComponent} from '../space/entity-field/entity-field.component';
import {GroupEntitiesPipe} from '../pipes/group-entities';
import {SpaceManager} from '../services/space-manager.service';
import {CommonModule} from '@angular/common';
import {SpaceResolver} from '../resolvers/space';
import {SpaceSyncComponent} from "./modals/sync/space-sync.component";
import {StoryEntryComponent} from './story-entry/story-entry.component';
import {ActorComponent} from "./actor/actor.component";
import {EpicComponent} from "./epic/epic.component";

@NgModule({
    declarations: [
        SpaceComponent,
        AnchorPipe,
        LabelPipe,
        TokenTypePipe,
        SprintsComponent,
        EpicsComponent,
        EpicComponent,
        ActorsComponent,
        ActorComponent,
        TermsComponent,
        ValidateComponent,
        GroupFeaturesByEpicPipe,
        GroupFeaturesByActorPipe,
        FeatureComponent,
        TokensComponent,
        IssueComponent,
        SprintComponent,
        EntityComponent,
        PackagesComponent,
        TermComponent,
        FeatureTermsPipe,
        PackageComponent,
        FitWidthDirective,
        EntityFieldComponent,
        GroupEntitiesPipe,
        SpaceSyncComponent,
        StoryEntryComponent
    ],
    entryComponents: [SpaceSyncComponent],
    imports: [
        CommonModule,
        JunteUiModule,
        ReactiveFormsModule,
        ClickOutsideModule,
        DndModule,
        RouterModule.forChild([
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
        ])
    ],
    providers: [
        FramesStorage,
        SpaceResolver,
        SprintResolver,
        ClipboardService,
        SpaceManager
    ]
})
export class SpaceModule {
}
