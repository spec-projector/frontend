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
              private modal: ModalService) {
  }

  ngOnInit() {
    this.route.data.subscribe(({me}) => this.me = me);
  }

  localize(language: Language) {
    document.location.href = document.location.pathname
      .replace(LOCALIZE_REGEX, `/${language}/`);
  }

  logout() {
    this.config.token = null;
    this.router.navigate(['/']).then(() => null);
  }

  changePassword() {
    const component = this.cfr.resolveComponentFactory(ChangePasswordComponent).create(this.injector);
    component.instance.closed.subscribe(() => this.modal.close());
    this.modal.open(component, {title: {text: 'Change password', icon: UI.icons.lock}});
  }
}
