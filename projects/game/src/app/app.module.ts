import { DragDropModule } from '@angular/cdk/drag-drop';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JunteUiModule } from 'junte-ui';
import { AppRoutingModule } from 'projects/game/src/app/app-routing.module';
import { AppComponent } from './app.component';
import { KanbanComponent } from './kanban/kanban.component';
import { CodesPipe } from './kanban/kanban.pipe';

@NgModule({
    declarations: [
        AppComponent,
        KanbanComponent,
        CodesPipe
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
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
