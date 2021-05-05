import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UI } from '@junte/ui';
import { LocalUI } from 'src/enums/local-ui';
import { SpecManager } from 'src/app/spec/managers';
import { EditMode } from 'src/enums/edit-mode';
import { Entity } from '../../../../../../models/spec/orm/entity';
import { EntityField } from '../../../../../../models/spec/orm/entity-field';
import { trackElement } from '../../../../../../utils/templates';

@Component({
  selector: 'spec-entity-edit',
  templateUrl: './entity-fields.component.html',
  styleUrls: ['./entity-fields.component.scss']
})
export class EntityFieldsComponent implements OnInit {

  ui = UI;
  localUi = LocalUI;
  editMode = EditMode;
  trackElement = trackElement;

  entity: Entity;

  mode = EditMode.view;

  constructor(public manager: SpecManager,
              private cd: ChangeDetectorRef,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.data.subscribe(({entity}) => this.entity = entity);
  }

  addField() {
    const field = new EntityField({
      title: $localize`:@@label.new_entity_field_title:First Name`,
      name: $localize`:@@label.new_entity_field_name:first_name`
    });
    field.linking({spec: this.entity.spec, entity: this.entity});
    field.new();
    this.manager.put(field);

    this.entity.addField(field);
    this.manager.put(this.entity);
  }

  deleteField(field: EntityField) {
    const links = field.delete();
    links.deleted.forEach(o => this.manager.remove(o));
    links.changed.forEach(o => this.manager.put(o));
    this.manager.remove(field);

    this.cd.detectChanges();
  }

  moveField(event: CdkDragDrop<EntityField[]>) {
    moveItemInArray(this.entity.fields, event.previousIndex, event.currentIndex);
    this.manager.put(this.entity);
  }

}
