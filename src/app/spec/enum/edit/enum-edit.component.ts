import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UI } from '@junte/ui';
import { EditMode } from 'src/enums/edit-mode';
import { LocalUI } from 'src/enums/local-ui';
import { SpecManager } from 'src/managers/spec.manager';
import { Enum, EnumOption } from '../../../../models/spec/orm/enum';

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

  constructor(public manager: SpecManager,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.data.subscribe(({enum: _enum}) => this.enum = _enum);
  }

  addOption() {
    const option = new EnumOption({
      title: 'Option',
      name: 'option'
    });
    this.enum.options.push(option);
  }

  deleteOption(index: number) {
    this.enum.options.splice(index, 1);
    this.manager.put(this.enum);
  }

  moveOption(event: CdkDragDrop<EnumOption[]>) {
    moveItemInArray(this.enum.options, event.previousIndex, event.currentIndex);
    this.manager.put(this.enum);
  }

  trackOption(index: number) {
    return index;
  }

}
