import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UI } from '@junte/ui';
import { LocalUI } from 'src/app/enums/local-ui';
import { SpecManager } from 'src/app/managers/spec.manager';
import { EditMode } from 'src/app/model/enums/edit-mode';
import { Entity } from '../../../../model/spec/orm/entity';

@Component({
  selector: 'spec-entity-edit',
  templateUrl: './entity-edit.component.html',
  styleUrls: ['./entity-edit.component.scss']
})
export class EntityEditComponent implements OnInit {

  ui = UI;
  localUi = LocalUI;
  editMode = EditMode;

  entity: Entity;

  mode = EditMode.view;

  constructor(public manager: SpecManager,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.data.subscribe(({entity}) => this.entity = entity);
  }

}
