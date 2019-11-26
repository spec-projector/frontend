import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { JunteUiModule } from 'junte-ui';
import { ClickOutsideModule } from 'ng4-click-outside';
import { ClipboardService } from 'ngx-clipboard';
import { DndModule } from 'ngx-drag-drop';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { ActorComponent } from 'src/app/components/spec/actors/actor/actor.component';
import { ActorsComponent } from 'src/app/components/spec/actors/actors.component';
import { DetailsComponent } from 'src/app/components/spec/details/details.component';
import { EntityFieldComponent } from 'src/app/components/spec/entities/entity-field/entity-field.component';
import { EntityComponent } from 'src/app/components/spec/entities/entity/entity.component';
import { EpicComponent } from 'src/app/components/spec/epics/epic/epic.component';
import { EpicsComponent } from 'src/app/components/spec/epics/epics.component';
import { FeatureAddFrameComponent } from 'src/app/components/spec/feature/add-frame/feature-add-frame.component';
import { FeatureEditGraphqlComponent } from 'src/app/components/spec/feature/edit-graphql/feature-edit-graphql.component';
import { FeatureMarkdownComponent } from 'src/app/components/spec/feature/markdown/feature-markdown.component';
import { FeatureComponent } from 'src/app/components/spec/feature/feature.component';
import { FeatureResourcesComponent } from 'src/app/components/spec/feature/resources/feature-resources.component';
import { IssueComponent } from 'src/app/components/spec/issue/issue.component';
import { PackageComponent } from 'src/app/components/spec/packages/package/package.component';
import { PackagesComponent } from 'src/app/components/spec/packages/packages.component';
import { SpecRoutingModule } from 'src/app/components/spec/spec-routing.module';
import { SpecComponent } from 'src/app/components/spec/spec.component';
import { SpecResolver } from 'src/app/components/spec/spec.resolver';
import { SprintComponent } from 'src/app/components/spec/sprints/sprint/sprint.component';
import { SprintsComponent } from 'src/app/components/spec/sprints/sprints.component';
import { SprintResolver } from 'src/app/components/spec/sprints/sprints.resolver';
import { StoryEntryComponent } from 'src/app/components/spec/story-entry/story-entry.component';
import { TermComponent } from 'src/app/components/spec/terms/term/term.component';
import { TermsComponent } from 'src/app/components/spec/terms/terms.component';
import { TokensComponent } from 'src/app/components/spec/tokens/tokens.component';
import { ValidateComponent } from 'src/app/components/spec/validate/validate.component';
import { FitWidthDirective } from 'src/app/directives/fit-width.directive';
import { SpecManager } from 'src/app/managers/spec.manager';
import { ActorPricePipe } from 'src/app/pipes/actors/actor-price';
import { FeaturePricePipe } from 'src/app/pipes/features/feature-price';
import { FeatureTermsPipe } from 'src/app/pipes/features/feature-terms';
import { FeaturesPipe } from 'src/app/pipes/features/features';
import { GroupEntitiesPipe } from 'src/app/pipes/group-entities';
import { GroupFeaturesByActorPipe, GroupFeaturesByEpicPipe } from 'src/app/pipes/group-features';
import { SpecPricePipe } from 'src/app/pipes/spec/actor-price';
import { EncodeURIPipe } from 'src/app/pipes/string/array';
import { TermDescriptionPipe } from 'src/app/pipes/terms/description';
import { TokenTypePipe } from 'src/app/pipes/token-type';
import { JoinTokensPipe } from 'src/app/pipes/tokens/join';
import { FramesStorage } from 'src/app/services/frames-storage.service';
import { SpaceSyncComponent } from './sync/space-sync.component';

@NgModule({
    declarations: [
        SpecComponent,
        DetailsComponent,
        SprintsComponent,
        EpicsComponent,
        EpicComponent,
        ActorsComponent,
        ActorComponent,
        TermsComponent,
        ValidateComponent,
        FeatureComponent,
        FeatureAddFrameComponent,
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
        FeaturesPipe,
        JoinTokensPipe,
        TermDescriptionPipe,
        FeatureEditGraphqlComponent,
        EncodeURIPipe,
        FeatureMarkdownComponent,
        FeatureResourcesComponent,
        FeaturePricePipe,
        ActorPricePipe,
        SpecPricePipe
    ],
    entryComponents: [
        SpaceSyncComponent,
        FeatureEditGraphqlComponent
    ],
    imports: [
        SpecRoutingModule,
        CommonModule,
        JunteUiModule,
        ReactiveFormsModule,
        ClickOutsideModule,
        DndModule,
        DragDropModule,
        MonacoEditorModule
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
