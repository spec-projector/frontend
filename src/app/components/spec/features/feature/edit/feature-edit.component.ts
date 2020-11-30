import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UI } from '@junte/ui';
import { LocalUI } from 'src/app/enums/local-ui';
import { EditMode } from 'src/app/model/enums/edit-mode';
import { Feature } from 'src/app/model/spec/planning/feature';

@Component({
  selector: 'spec-feature-edit',
  templateUrl: './feature-edit.component.html',
  styleUrls: ['./feature-edit.component.scss']
})
export class FeatureEditComponent implements OnInit {

  ui = UI;
  localUi = LocalUI;
  editMode = EditMode;

  feature: Feature;

  mode = EditMode.view;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.data.subscribe(({feature}) => this.feature = feature);
  }

}
