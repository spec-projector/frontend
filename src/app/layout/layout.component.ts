import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UI } from '@junte/ui';
import { AppConfig } from 'src/app/app-config';
import {LocalUI} from '../../enums/local-ui';

@Component({
  selector: 'spec-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {

  ui = UI;
  localUi = LocalUI;

  @ViewChild('layout', {read: ElementRef, static: true})
  backdrop;

  constructor(private router: Router,
              public config: AppConfig) {
  }

  logout() {
    this.config.authorization = null;
    this.router.navigate(['/login']).then(() => null);
  }
}
