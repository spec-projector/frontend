import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UI } from '@junte/ui';
import { AppConfig } from 'src/app/app-config';
import { Language } from 'src/enums/language';
import { LocalUI } from '../../enums/local-ui';
import { MeUser } from '../../models/user';

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

  constructor(public config: AppConfig,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.route.data.subscribe(({me}) => this.me = me);
  }

  logout() {
    this.config.token = null;
    this.router.navigate(['/']).then(() => null);
  }
}
