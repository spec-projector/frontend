import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UI } from '@junte/ui';
import { Language } from 'src/enums/language';

@Component({
  selector: 'jnt-select-lang',
  templateUrl: './select-lang.component.html',
  styleUrls: ['./select-lang.component.scss']
})

export class SelectLangComponent {

  ui = UI;
  language = Language;

  langControl = this.fb.control(this.lang);
  form = this.fb.group({
    lang: this.langControl
  });

  constructor(@Inject(Language) private lang: Language,
              private fb: FormBuilder) {
  }

  change(lang: Language) {
    const pathname = document.location.pathname;
    const path = pathname.substring(pathname.indexOf('/', 1) + 1);
    document.location.href = `/${lang}/${path}`;
  }
}
