import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JunteUiModule } from 'junte-ui';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { GraphQLModule } from 'src/app/graphql.module';
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
        MonacoEditorModule.forRoot(),
        LoggerModule.forRoot({
            serverLoggingUrl: '/api/logs',
            level: NgxLoggerLevel.LOG,
            serverLogLevel: NgxLoggerLevel.OFF
        })
    ],
    bootstrap: [
        AppComponent
    ],
    providers: [
        HttpClient
    ]
})
export class AppModule {
}
