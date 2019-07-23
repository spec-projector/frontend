import {DragDropModule} from '@angular/cdk/drag-drop';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {JunteUiModule} from 'junte-ui';
import {ClickOutsideModule} from 'ng4-click-outside';
import {ClipboardService} from 'ngx-clipboard';
import {DndModule} from 'ngx-drag-drop';
import {FeatureTermsPipe} from 'src/app/components/spec/pipes/feature-terms';
import {GroupEntitiesPipe} from 'src/app/components/spec/pipes/group-entities';
import {GroupFeaturesByActorPipe, GroupFeaturesByEpicPipe} from 'src/app/components/spec/pipes/group-features';
import {TokenTypePipe} from 'src/app/components/spec/pipes/token-type';
import {SpecResolver} from 'src/app/resolvers/spec';
import {SprintResolver} from 'src/app/resolvers/sprint';
import {FramesStorage} from 'src/app/services/frames-storage.service';
import {SpecManager} from 'src/app/managers/spec.manager';
import {FitWidthDirective} from 'src/app/directives/fit-width.directive';
import {ActorComponent} from './actors/actor/actor.component';
import {ActorsComponent} from './actors/actors.component';
import {EntityFieldComponent} from './entities/entity-field/entity-field.component';
import {EntityComponent} from './entities/entity/entity.component';
import {EpicComponent} from './epics/epic/epic.component';
import {EpicsComponent} from './epics/epics.component';
import {FeatureComponent} from './feature/feature.component';
import {IssueComponent} from './issue/issue.component';
import {SpaceSyncComponent} from './sync/space-sync.component';
import {PackageComponent} from './packages/package/package.component';
import {PackagesComponent} from './packages/packages.component';
import {SprintComponent} from './sprints/sprint/sprint.component';
import {SprintsComponent} from './sprints/sprints.component';
import {StoryEntryComponent} from './story-entry/story-entry.component';
import {TermComponent} from './terms/term/term.component';
import {TermsComponent} from './terms/terms.component';
import {TokensComponent} from './tokens/tokens.component';
import {ValidateComponent} from './validate/validate.component';
import {SpecComponent} from './spec.component';
import {FeaturesPipe} from './pipes/features';
import {SpecRoutingModule} from "./spec-routing.module";

@NgModule({
    declarations: [
        SpecComponent,
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
        StoryEntryComponent,
        FeaturesPipe
    ],
    entryComponents: [SpaceSyncComponent],
    imports: [
        SpecRoutingModule,
        CommonModule,
        JunteUiModule,
        ReactiveFormsModule,
        ClickOutsideModule,
        DndModule,
        DragDropModule
    ],
    providers: [
        FramesStorage,
        SpecResolver,
        SprintResolver,
        ClipboardService,
        SpecManager
    ]
})
export class SpecModule {
}
