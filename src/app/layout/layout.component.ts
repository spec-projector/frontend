import { Component, ComponentFactoryResolver, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService, UI } from '@junte/ui';
import { map } from 'rxjs/operators';
import { deserialize } from 'serialize-ts';
import { AppConfig } from 'src/app/app-config';
import { Language } from 'src/enums/language';
import { CURRENT_LANGUAGE, LANGUAGE_CHANGE_REGEX } from '../../consts';
import { LocalUI } from '../../enums/local-ui';
import { MeUser } from '../../models/user';
import { MeGQL } from '../../resolvers/graphql';
import { MeUpdated, SignalsService } from '../../signals/signals.service';
import { catchGQLErrors } from '../../utils/gql-errors';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { ChangePersonalDataComponent } from '../change-personal-data/change-personal-data.component';

@Component({
  selector: 'spec-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  ui = UI;
  localUi = LocalUI;
  language = Language;
  consts = {language: CURRENT_LANGUAGE};

  me: MeUser;

  @ViewChild('layout', {read: ElementRef, static: true})
  backdrop;

  constructor(private meGQL: MeGQL,
              public config: AppConfig,
              private injector: Injector,
              private cfr: ComponentFactoryResolver,
              private modal: ModalService,
              private signals: SignalsService,
              private route: ActivatedRoute,
              public router: Router) {
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

  changeLanguage(target: Language) {
    document.location.href = document.location.pathname
      .replace(LANGUAGE_CHANGE_REGEX, `/${target}/`);
  }

  logout() {
    this.config.token = null;
    this.router.navigate(['/']).then(() => null);
  }

  changePersonalData() {
    const component = this.cfr.resolveComponentFactory(ChangePersonalDataComponent)
      .create(this.injector);
    component.instance.me = this.me;
    component.instance.changed.subscribe(() => this.modal.close());
    this.modal.open(component, {
      title:
        {
          text: $localize`:@@label.change_personal_data:Change personal data`,
          icon: UI.icons.settings
        }
    });
  }

  changePassword() {
    const component = this.cfr.resolveComponentFactory(ChangePasswordComponent)
      .create(this.injector);
    component.instance.saved.subscribe(() => this.modal.close());
    this.modal.open(component, {
      title:
        {
          text: $localize`:@@label.change_password:Change password`,
          icon: UI.icons.lock
        }
    });
  }

}
