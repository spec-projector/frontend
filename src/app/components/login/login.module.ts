import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { JunteUiModule } from 'junte-ui';
import { LoginRoutingModule } from 'src/app/components/login/login-routing.module';
import { LoginComponent } from 'src/app/components/login/login.component';
import { FormPipesModule } from 'src/app/pipes/forms/forms.module';
import { UsersServiceProvider } from 'src/app/services/users/users.provider';

@NgModule({
    declarations: [
        LoginComponent
    ],
    imports: [
        CommonModule,
        JunteUiModule,
        ReactiveFormsModule,
        LoginRoutingModule,
        FormPipesModule
    ],
    providers: [UsersServiceProvider]
})
export class LoginModule {
}
