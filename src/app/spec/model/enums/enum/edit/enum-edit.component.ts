import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UI } from '@junte/ui';
import { EditMode } from 'src/enums/edit-mode';
import { LocalUI } from 'src/enums/local-ui';
import { SpecManager } from 'src/app/spec/managers';
import { Enum, EnumOption } from '../../../../../../models/spec/orm/enum';
import { generate as shortid } from 'shortid';

@Component({
  selector: 'spec-enum-edit',
  templateUrl: './enum-edit.component.html',
  styleUrls: ['./enum-edit.component.scss']
})
export class EnumEditComponent implements OnInit {

  ui = UI;
  localUi = LocalUI;
  editMode = EditMode;

  enum: Enum;
  mode = EditMode.view;

  added: string;

  constructor(public manager: SpecManager,
              private cd: ChangeDetectorRef,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.data.subscribe(({enum: _enum}) => this.enum = _enum);
  }

  addOption() {
    const option = new EnumOption({
      id: shortid(),
      title: 'Option',
      name: 'option'
    });
    option.linking(this.enum);
    this.enum.options.push(option);
    this.manager.put(option);
    this.manager.put(this.enum);

    this.added = option.id;
    this.cd.detectChanges();
  }

  deleteOption(option: EnumOption) {
    const links = option.delete();
    links.deleted.forEach(o => this.manager.remove(o));
    links.changed.forEach(o => this.manager.put(o));
    this.manager.remove(option);

    this.cd.detectChanges();
  }

  moveOption(event: CdkDragDrop<EnumOption[]>) {
    moveItemInArray(this.enum.options, event.previousIndex, event.currentIndex);
    this.manager.put(this.enum);
  }

  trackOption(index: number) {
    return index;
  }

}
