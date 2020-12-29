import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UI } from '@junte/ui';
import { LocalUI } from 'src/enums/local-ui';
import { SpecManager } from 'src/managers/spec.manager';
import { EditMode } from 'src/enums/edit-mode';
import { Entity } from '../../../../model/spec/orm/entity';
import { EntityField } from '../../../../model/spec/orm/entity-field';

@Component({
  selector: 'spec-entity-edit',
  templateUrl: './entity-fields.component.html',
  styleUrls: ['./entity-fields.component.scss']
})
export class EntityFieldsComponent implements OnInit {

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

  addField() {
    const field = new EntityField({
      title: 'Field',
      name: 'field'
    });
    field.linking(this.entity);
    this.entity.fields.push(field);
    this.manager.put(this.entity);
  }

  deleteField(index: number) {
    this.entity.fields.splice(index, 1);
    this.manager.put(this.entity);
  }

  moveField(event: CdkDragDrop<EntityField[]>) {
    moveItemInArray(this.entity.fields, event.previousIndex, event.currentIndex);
    this.manager.put(this.entity);
  }

  trackField(index: number) {
    return index;
  }

}
