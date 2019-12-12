import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JunteUiModule } from 'junte-ui';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { AppConfig } from 'src/app/app-config';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { GraphQLModule } from 'src/app/graphql.module';
import { MeManager } from 'src/app/managers/me.manager';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        JunteUiModule,
        AppRoutingModule,
        GraphQLModule,
        MonacoEditorModule.forRoot()
    ],
    bootstrap: [
        AppComponent
    ],
    providers: [
        AppConfig,
        HttpClient,
        MeManager
    ]
})
export class AppModule {
}
