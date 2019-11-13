import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { JunteUiModule } from 'junte-ui';
import { ClickOutsideModule } from 'ng4-click-outside';
import { ClipboardService } from 'ngx-clipboard';
import { DndModule } from 'ngx-drag-drop';
import { ActorComponent } from 'src/app/components/spec/actors/actor/actor.component';
import { ActorsComponent } from 'src/app/components/spec/actors/actors.component';
import { EntityFieldComponent } from 'src/app/components/spec/entities/entity-field/entity-field.component';
import { EntityComponent } from 'src/app/components/spec/entities/entity/entity.component';
import { EpicComponent } from 'src/app/components/spec/epics/epic/epic.component';
import { EpicsComponent } from 'src/app/components/spec/epics/epics.component';
import { FeatureComponent } from 'src/app/components/spec/feature/feature.component';
import { IssueComponent } from 'src/app/components/spec/issue/issue.component';
import { PackageComponent } from 'src/app/components/spec/packages/package/package.component';
import { PackagesComponent } from 'src/app/components/spec/packages/packages.component';
import { SpecRoutingModule } from 'src/app/components/spec/spec-routing.module';
import { SpecComponent } from 'src/app/components/spec/spec.component';
import { SprintComponent } from 'src/app/components/spec/sprints/sprint/sprint.component';
import { SprintsComponent } from 'src/app/components/spec/sprints/sprints.component';
import { StoryEntryComponent } from 'src/app/components/spec/story-entry/story-entry.component';
import { TermComponent } from 'src/app/components/spec/terms/term/term.component';
import { TermsComponent } from 'src/app/components/spec/terms/terms.component';
import { TokensComponent } from 'src/app/components/spec/tokens/tokens.component';
import { ValidateComponent } from 'src/app/components/spec/validate/validate.component';
import { FitWidthDirective } from 'src/app/directives/fit-width.directive';
import { FeatureTermsPipe } from 'src/app/pipes/features/feature-terms';
import { FeaturesPipe } from 'src/app/pipes/features/features';
import { GroupEntitiesPipe } from 'src/app/pipes/group-entities';
import { GroupFeaturesByActorPipe, GroupFeaturesByEpicPipe } from 'src/app/pipes/group-features';
import { TokenTypePipe } from 'src/app/pipes/token-type';
import { SpecResolver } from 'src/app/components/spec/spec.resolver';
import { SprintResolver } from 'src/app/components/spec/sprints/sprints.resolver';
import { FramesStorage } from 'src/app/services/frames-storage.service';
import { SpaceSyncComponent } from './sync/space-sync.component';

@NgModule({
    declarations: [
        SpecComponent,
        SprintsComponent,
        EpicsComponent,
        EpicComponent,
        ActorsComponent,
        ActorComponent,
        TermsComponent,
        ValidateComponent,
        FeatureComponent,
        TokensComponent,
        IssueComponent,
        SprintComponent,
        EntityComponent,
        PackagesComponent,
        TermComponent,
        PackageComponent,
        FitWidthDirective,
        EntityFieldComponent,
        SpaceSyncComponent,
        StoryEntryComponent,
        TokenTypePipe,
        GroupFeaturesByEpicPipe,
        GroupFeaturesByActorPipe,
        FeatureTermsPipe,
        GroupEntitiesPipe,
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
        ClipboardService
    ]
})
export class SpecModule {
}
