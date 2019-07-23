import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Authorization, Error, validate } from 'junte-angular';
import { UI } from 'junte-ui';
import 'reflect-metadata';
import { filter, finalize } from 'rxjs/operators';
import { AppConfig } from 'src/app/app-config';
import { LoginCredentials } from 'src/app/model/login-credentials';
import { IUsersService, users_service } from 'src/app/services/users/users.interface';

@Component({
    selector: 'spec-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    ui = UI;

    progress = {gitlab: false, login: false};
    error: Error;
    loginForm = this.builder.group({
        login: [null, [Validators.required]],
        password: [null, [Validators.required]]
    });

    constructor(@Inject(users_service) private usersService: IUsersService,
                private config: AppConfig,
                private builder: FormBuilder,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        this.route.queryParams.pipe(filter(({code, state}) => !!code && !!state))
            .subscribe(({code, state}) => {
                this.progress.gitlab = true;
                this.usersService.gitlab(code, state)
                    .pipe(finalize(() => this.progress.gitlab = false))
                    .subscribe(authorization => this.logged(authorization),
                        error => this.error = error);
            });
    }

    login() {
        if (validate(this.loginForm)) {
            this.progress.login = true;
            this.usersService.login(new LoginCredentials(this.loginForm.value))
                .pipe(finalize(() => this.progress.login = false))
                .subscribe(authorization => this.logged(authorization),
                    error => this.error = error);
        }
    }

    private logged(authorization: Authorization) {
        this.config.authorization = authorization;
        this.router.navigate(['/']).then(() => null);
    }
}
