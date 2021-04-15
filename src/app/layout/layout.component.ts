import { Component, ElementRef, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { ComponentFactoryResolver, Injector } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService, UI } from '@junte/ui';
import { AppConfig } from 'src/app/app-config';
import { Language } from 'src/enums/language';
import { LOCALIZE_REGEX } from '../../consts';
import { LocalUI } from '../../enums/local-ui';
import { MeUser } from '../../models/user';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { ChangePersonalDataComponent } from '../change-personal-data/change-personal-data.component';
import { MeUpdated, Signals } from '../../signals/signals';
import { MeGQL } from '../../resolvers/graphql';
import { catchGQLErrors } from '../../utils/gql-errors';
import { map } from 'rxjs/operators';
import { deserialize } from 'serialize-ts';

@Component({
  selector: 'spec-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  ui = UI;
  localUi = LocalUI;
  language = Language;

  me: MeUser;

  langControl = this.fb.control(this.language);
  form = this.fb.group({
    lang: this.langControl
  });

  @ViewChild('layout', {read: ElementRef, static: true})
  backdrop;

  constructor(@Inject(LOCALE_ID) public locale: string,
              public config: AppConfig,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private injector: Injector,
              private cfr: ComponentFactoryResolver,
              private modal: ModalService,
              private signals: Signals,
              private meGQL: MeGQL) {
  }

  ngOnInit() {
    this.route.data.subscribe(({me}) => this.me = me);
    this.signals.events.subscribe(e => {
      if (e instanceof MeUpdated) {
        this.load();
      }
    });
  }

  load() {
    this.meGQL.fetch().pipe(catchGQLErrors(),
        map(({data: {me}}) => deserialize(me, MeUser)))
      .subscribe(me => this.me = me);
  }

  localize(language: Language) {
    document.location.href = document.location.pathname
      .replace(LOCALIZE_REGEX, `/${language}/`);
  }

  logout() {
    this.config.token = null;
    this.router.navigate(['/']).then(() => null);
  }

  changePersonalData() {
    const component = this.cfr.resolveComponentFactory(ChangePersonalDataComponent).create(this.injector);
    component.instance.closed.subscribe(() => this.modal.close());
    component.instance.me = this.me;
    component.instance.changed.subscribe(() => {
      this.signals.dispatch(new MeUpdated());
      this.modal.close();
    });
    this.modal.open(component, {title: {text: 'Change personal data', icon: UI.icons.settings}});
  }

  changePassword() {
    const component = this.cfr.resolveComponentFactory(ChangePasswordComponent).create(this.injector);
    component.instance.closed.subscribe(() => this.modal.close());
    this.modal.open(component, {title: {text: 'Change password', icon: UI.icons.lock}});
  }
}
