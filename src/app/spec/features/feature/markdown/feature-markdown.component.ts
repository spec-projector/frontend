import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import { Feature } from 'src/model/spec/planning/feature';
import { TokenType } from 'src/model/spec/planning/token';
import { BASE_URI } from '../../../../../consts';
import { Project } from '../../../../../model/projects';

@Component({
  selector: 'spec-feature-markdown',
  templateUrl: './feature-markdown.component.html',
  styleUrls: ['./feature-markdown.component.scss']
})
export class FeatureMarkdownComponent implements OnInit, AfterViewChecked {

  tokenType = TokenType;
  consts = {baseUri: BASE_URI};

  @ViewChild('raw', {static: false, read: ElementRef})
  raw: ElementRef<HTMLElement>;

  @ViewChild('markdown', {static: false, read: ElementRef})
  markdown: ElementRef<HTMLElement>;

  formatted: string;

  project: Project;
  feature: Feature;

  constructor(private clipboard: ClipboardService,
              private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.route.data.subscribe(({project, feature}) => [this.project, this.feature] = [project, feature]);
  }

  ngAfterViewChecked() {
    if (!this.formatted) {
      this.formatted = this.raw.nativeElement
        .innerHTML.replace(/\<\!\-\-\-\-\>\n*/, '');
      this.markdown.nativeElement.innerHTML = this.formatted;
      this.clipboard.copy(this.formatted);
    }
  }
}