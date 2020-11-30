import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalComponent, ModalService, PopoverComponent, PopoverService, UI } from '@junte/ui';
import { AppConfig } from 'src/app/app-config';

@Component({
  selector: 'spec-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements AfterViewInit {

  ui = UI;

  @ViewChild('popover', {static: false})
  popover: PopoverComponent;

  @ViewChild('modal', {static: false})
  modal: ModalComponent;

  @ViewChild('layout', {read: ElementRef, static: true})
  backdrop;

  constructor(private modalService: ModalService,
              private popoverService: PopoverService,
              private router: Router,
              private config: AppConfig) {
  }

  ngAfterViewInit() {
    this.modalService.register(this.modal);
    this.popoverService.register(this.popover);
  }

  logout() {
    this.config.authorization = null;
    this.router.navigate(['/login']).then(() => null);
  }
}
