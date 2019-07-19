import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { JunteUiModule } from 'junte-ui';
import { ClickOutsideModule } from 'ng4-click-outside';
import { ClipboardService } from 'ngx-clipboard';
import { DndModule } from 'ngx-drag-drop';
import { FeatureTermsPipe } from 'src/app/pipes/feature-terms';
import { GroupEntitiesPipe } from 'src/app/pipes/group-entities';
import { GroupFeaturesByActorPipe, GroupFeaturesByEpicPipe } from 'src/app/pipes/group-features';
import { TokenTypePipe } from 'src/app/pipes/token-type';
import { SpaceResolver } from 'src/app/resolvers/space';
import { SprintResolver } from 'src/app/resolvers/sprint';
import { FramesStorage } from 'src/app/services/frames-storage.service';
import { SpaceManager } from 'src/app/services/space-manager.service';
import { FitWidthDirective } from 'src/directives/fit-width.directive';
import { AnchorPipe } from 'src/pipes/anchor';
import { LabelPipe } from 'src/pipes/label';
import { ActorComponent } from '../actors/actor/actor.component';
import { ActorsComponent } from '../actors/actors.component';
import { EntityFieldComponent } from '../entities/entity-field/entity-field.component';
import { EntityComponent } from '../entities/entity/entity.component';
import { EpicComponent } from '../epics/epic/epic.component';
import { EpicsComponent } from '../epics/epics.component';
import { FeatureComponent } from '../feature/feature.component';
import { IssueComponent } from '../issue/issue.component';
import { SpaceSyncComponent } from '../modals/sync/space-sync.component';
import { PackageComponent } from '../packages/package/package.component';
import { PackagesComponent } from '../packages/packages.component';
import { SpaceRoutingModule } from '../space/space-routing.module';
import { SpaceComponent } from '../space/space.component';
import { SpacePipe } from '../space/space.pipe';
import { SprintComponent } from '../sprints/sprint/sprint.component';
import { SprintsComponent } from '../sprints/sprints.component';
import { StoryEntryComponent } from '../story-entry/story-entry.component';
import { TermComponent } from '../terms/term/term.component';
import { TermsComponent } from '../terms/terms.component';
import { TokensComponent } from '../tokens/tokens.component';
import { ValidateComponent } from '../validate/validate.component';

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
