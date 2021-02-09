import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { deserialize } from 'serialize-ts';
import { FormComponent, UI } from '@junte/ui';
import 'reflect-metadata';
import { filter, finalize, map } from 'rxjs/operators';
import { AppConfig } from 'src/app/app-config';
import { GitlabLoginGQL, LoginGQL } from 'src/app/login/login.graphql';
import { Authorization } from 'src/model/authorization';
import { UserCredentials } from '../../model/user';
import { BackendError } from '../../types/gql-errors';
import { catchGQLErrors } from '../../utils/gql-errors';

@Component({
  selector: 'spec-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  ui = UI;

  progress = {gitlab: false, login: false};
  errors: BackendError[] = [];

  form = this.builder.group({
    login: [null, [Validators.required]],
    password: [null, [Validators.required]]
  });

  @ViewChild(FormComponent)
  formComponent: FormComponent;

  @ViewChild('content', {read: ElementRef})
  backdrop: ElementRef<HTMLElement>;

  constructor(private loginGQL: LoginGQL,
              private loginGitlabGQL: GitlabLoginGQL,
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
        this.loginGitlabGQL.mutate({code: code, state: state})
          .pipe(
            finalize(() => this.progress.gitlab = false),
            map(({data: {completeGitlabAuth: {token}}}) =>
              deserialize(token, Authorization))
          )
          .subscribe((token: Authorization) => this.logged(token),
            errors => this.errors = errors);
      });
  }

  submit() {
    this.formComponent.submit();
  }

  login() {
    const request = new UserCredentials(this.form.getRawValue());
    this.progress.login = true;
    this.loginGQL.mutate(request)
      .pipe(
        finalize(() => this.progress.login = false),
        catchGQLErrors(),
        map(({data: {login: {token}}}) =>
          deserialize(token, Authorization))
      )
      .subscribe((token: Authorization) => this.logged(token),
        errors => this.errors = errors);
  }

  private logged(authorization: Authorization) {
    this.config.authorization = authorization;
    this.router.navigate(['/']).then(() => null);
  }
}
