import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { UI } from '@junte/ui';
import { AppConfig } from 'src/app/app-config';
import { Language } from 'src/enums/language';
import {LocalUI} from '../../enums/local-ui';

@Component({
  selector: 'spec-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {

  ui = UI;
  localUi = LocalUI;
  language = Language;

  langControl = this.fb.control(this.language);
  form = this.fb.group({
    lang: this.langControl
  });


  @ViewChild('layout', {read: ElementRef, static: true})
  backdrop;

  constructor(private fb: FormBuilder,
              private router: Router,
              public config: AppConfig) {
  }

  logout() {
    this.config.token = null;
    this.router.navigate(['/']).then(() => null);
  }
}
