import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UI } from '@junte/ui';
import { EditMode } from 'src/enums/edit-mode';
import { Language } from 'src/enums/language';
import { Spec } from 'src/models/spec/spec';
import { LocalUI } from '../../../enums/local-ui';
import { MeUser } from '../../../models/user';

@Component({
  selector: 'spec-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  ui = UI;
  language = Language;
  localUi = LocalUI;
  editMode = EditMode;

  me: MeUser;
  spec: Spec;

  constructor(public route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.data.subscribe(({spec, me}) => [this.spec, this.me] = [spec, me]);
  }

}
