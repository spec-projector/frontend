import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { GraphQLModule } from 'src/app/graphql.module';
import { APP_PROVIDERS } from '../consts';
import { AppComponent } from './app.component';

// TODO: waiting for angular 10
@Component({
  selector: 'app-root',
  template: `
    <p i18n="@@label.change_personal_data">Change personal data</p>
    <p i18n="@@label.change_password">Change password</p>
    <p i18n="@@label.new_actor_example">Client</p>
    <p i18n="@@label.new_feature_example">Buy a cookies</p>
    <p i18n="@@label.new_module_example">Accepting payments</p>
    <p i18n="@@label.general:General">General</p>
    <p i18n="@@label.modules">Modules</p>
    <p i18n="@@label.features">Features</p>
    <p i18n="@@label.actors">Actors</p>
    <p i18n="@@label.knowledge">Knowledge</p>
    <p i18n="@@label.model">Model</p>
    <p i18n="@@label.print">Print</p>
    <p i18n="@@label.validate">Validate</p>
  `
})
export class I18nComponent {

}

@NgModule({
  declarations: [
    AppComponent,
    I18nComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
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
    HttpClient,
    ...APP_PROVIDERS
  ]
})
export class AppModule {

}
