import { DragDropModule } from '@angular/cdk/drag-drop';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JunteUiModule } from '@junte/ui';
import { AppRoutingModule } from 'projects/game/src/app/app-routing.module';
import { GroupComponent } from 'projects/game/src/app/kanban/group/group.component';
import { AppComponent } from './app.component';
import { KanbanComponent } from './kanban/kanban.component';
import { IssueComponent } from './kanban/issue/issue.component';

@NgModule({
    declarations: [
        AppComponent,
        KanbanComponent,
        GroupComponent,
        IssueComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        DragDropModule,
        JunteUiModule,
        AppRoutingModule
    ],
    providers: [
        {provide: LocationStrategy, useClass: HashLocationStrategy}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
