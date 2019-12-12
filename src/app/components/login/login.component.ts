import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApolloError } from 'apollo-client';
import { UI, validate } from 'junte-ui';
import 'reflect-metadata';
import { filter, finalize, map } from 'rxjs/operators';
import { deserialize } from 'serialize-ts/dist';
import { AppConfig } from 'src/app/app-config';
import { GitlabLoginGQL, LoginGQL } from 'src/app/components/login/login.graphql';
import { Authorization } from 'src/app/model/authorization';

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
        username: [null, [Validators.required]],
        password: [null, [Validators.required]]
    });

    constructor(private loginApollo: LoginGQL,
                private loginGitlabApollo: GitlabLoginGQL,
                private config: AppConfig,
                private builder: FormBuilder,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        this.route.queryParams
            .pipe(filter(({code, state}) => !!code && !!state))
            .subscribe(({code, state}) => {
                this.progress.gitlab = true;
                this.loginGitlabApollo.mutate({code: code, state: state})
                    .pipe(
                        finalize(() => this.progress.gitlab = false),
                        map(({data: {completeGitlabAuth: {token}}}) =>
                            deserialize(token, Authorization))
                    )
                    .subscribe((token: Authorization) => this.logged(token),
                        (error: ApolloError) => this.error = error);
            });
    }

    login() {
        if (validate(this.loginForm)) {
            this.progress.login = true;
            this.loginApollo.mutate(this.loginForm.value)
                .pipe(
                    finalize(() => this.progress.login = false),
                    map(({data: {login: {token}}}) =>
                        deserialize(token, Authorization))
                )
                .subscribe((token: Authorization) => this.logged(token),
                    (error: ApolloError) => this.error = error);
        }
    }

    private logged(authorization: Authorization) {
        this.config.authorization = authorization;
        this.router.navigate(['/']).then(() => null);
    }
}
