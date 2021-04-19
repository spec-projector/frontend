import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { UI } from '@junte/ui';
import { LocalUI } from '../../../enums/local-ui';

@Component({
  selector: 'spec-viewport',
  template: '',
  styles: [':host { display: none; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewportComponent implements OnInit, OnDestroy {

  ui = UI;
  localUi = LocalUI;

  viewport: { global?: HTMLMetaElement, current?: HTMLMetaElement } = {};
  listeners: { resize?: () => void } = {};

  ngOnInit() {
    const viewport = document.head.querySelector('meta[name=viewport]') as HTMLMetaElement;
    if (!!viewport) {
      document.head.removeChild(viewport);
      this.viewport.global = viewport;
    }

    this.render();

    const resize = () => this.render();
    window.addEventListener('resize', () => this.render());
    this.listeners.resize = resize;
  }

  ngOnDestroy() {
    if (!!this.viewport.current) {
      document.head.removeChild(this.viewport.current);
    }
    if (!!this.viewport.global) {
      document.head.appendChild(this.viewport.global);
    }

    if (!!this.listeners.resize) {
      window.removeEventListener('resize', this.listeners.resize);
    }
  }

  private render() {
    if (!!this.viewport.current) {
      document.head.removeChild(this.viewport.current);
      this.viewport.current = null;
    }

    const props = [];
    if (window.screen.availWidth > 425 && window.screen.availWidth < 970) {
      props.push('width=970');
    }
    const viewport = document.createElement('meta');
    viewport.setAttribute('name', 'viewport');
    viewport.setAttribute('content', props.length > 0 ? props.join(', ') : 'width=device-width, initial-scale=1');
    document.head.appendChild(viewport);

    this.viewport.current = viewport;
  }

}
