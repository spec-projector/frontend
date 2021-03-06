import { AfterViewChecked, Component, ElementRef, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UI } from '@junte/ui';
import { ClipboardService } from 'ngx-clipboard';
import { Language } from 'src/enums/language';
import { Feature } from 'src/models/spec/planning/feature/feature';
import { TokenType } from 'src/models/spec/planning/token';
import { BASE_URI, CURRENT_LANGUAGE } from '../../../../../consts';
import { Project } from '../../../../../models/project';

@Component({
  selector: 'spec-feature-markdown',
  templateUrl: './feature-markdown.component.html',
  styleUrls: ['./feature-markdown.component.scss']
})
export class FeatureMarkdownComponent implements OnInit, AfterViewChecked {

  tokenType = TokenType;
  language = Language;
  ui = UI;
  consts = {baseUri: BASE_URI, language: CURRENT_LANGUAGE};

  @ViewChild('raw', {static: false, read: ElementRef})
  raw: ElementRef<HTMLElement>;

  @ViewChild('markdown', {static: false, read: ElementRef})
  markdown: ElementRef<HTMLElement>;

  formatted: string;

  project: Project;
  feature: Feature;

  constructor(private clipboard: ClipboardService,
              private route: ActivatedRoute,
              @Inject(LOCALE_ID) public locale: string) {

  }

  ngOnInit() {
    this.route.data.subscribe(({project, feature}) => [this.project, this.feature] = [project, feature]);
  }

  ngAfterViewChecked() {
    if (!this.formatted) {
      this.formatted = this.raw.nativeElement
        .innerHTML.replace(/<!--[^>]*-->/gi, '');
      console.log(this.formatted);
      this.markdown.nativeElement.innerHTML = this.formatted;
      this.clipboard.copy(this.formatted);
    }
  }
}
