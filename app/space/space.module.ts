import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActorComponent } from 'app/space/actors/actor/actor.component';
import { EntityFieldComponent } from 'app/space/entities/entity-field/entity-field.component';
import { EntityComponent } from 'app/space/entities/entity/entity.component';
import { EpicComponent } from 'app/space/epics/epic/epic.component';
import { PackageComponent } from 'app/space/packages/package/package.component';
import { SpaceRoutingModule } from 'app/space/space-routing.module';
import { SprintComponent } from 'app/space/sprints/sprint/sprint.component';
import { TermComponent } from 'app/space/terms/term/term.component';
import { FitWidthDirective } from 'directives/fit-width.directive';
import { JunteUiModule } from 'junte-ui';
import { ClickOutsideModule } from 'ng4-click-outside';
import { ClipboardService } from 'ngx-clipboard';
import { DndModule } from 'ngx-drag-drop';
import { AnchorPipe } from 'pipes/anchor';
import { LabelPipe } from 'pipes/label';
import { FeatureTermsPipe } from '../pipes/feature-terms';
import { GroupEntitiesPipe } from '../pipes/group-entities';
import { GroupFeaturesByActorPipe, GroupFeaturesByEpicPipe } from '../pipes/group-features';
import { TokenTypePipe } from '../pipes/token-type';
import { SpaceResolver } from '../resolvers/space';
import { SprintResolver } from '../resolvers/sprint';
import { FramesStorage } from '../services/frames-storage.service';
import { SpaceManager } from '../services/space-manager.service';
import { ActorsComponent } from '../space/actors/actors.component';
import { EpicsComponent } from '../space/epics/epics.component';
import { FeatureComponent } from '../space/feature/feature.component';
import { IssueComponent } from '../space/issue/issue.component';
import { PackagesComponent } from '../space/packages/packages.component';
import { SprintsComponent } from '../space/sprints/sprints.component';
import { TermsComponent } from '../space/terms/terms.component';
import { TokensComponent } from '../space/tokens/tokens.component';
import { ValidateComponent } from '../space/validate/validate.component';
import { SpaceSyncComponent } from './modals/sync/space-sync.component';
import { SpaceComponent } from './space.component';
import { SpacePipe } from './space.pipe';
import { StoryEntryComponent } from './story-entry/story-entry.component';

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
        StoryEntryComponent,
        SpacePipe
    ],
    entryComponents: [SpaceSyncComponent],
    imports: [
        CommonModule,
        JunteUiModule,
        ReactiveFormsModule,
        ClickOutsideModule,
        DndModule,
        DragDropModule,
        SpaceRoutingModule
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
