import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Config, HttpMockService, HttpService } from 'junte-angular';
import { JunteUiModule } from 'junte-ui';
import { AppConfig } from 'src/app/app-config';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { MeServiceProvider } from 'src/app/services/me/me.provider';
import { UsersServiceProvider } from 'src/app/services/users/users.provider';
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
        AppRoutingModule
    ],
    bootstrap: [
        AppComponent
    ],
    providers: [
        {
            provide: Config,
            useExisting: AppConfig
        },
        HttpClient,
        HttpService,
        HttpMockService,
        MeServiceProvider,
        UsersServiceProvider
    ]
})
export class AppModule {
}
