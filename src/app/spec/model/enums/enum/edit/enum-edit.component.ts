import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UI } from '@junte/ui';
import { SpecManager } from 'src/app/spec/managers';
import { EditMode } from 'src/enums/edit-mode';
import { LocalUI } from 'src/enums/local-ui';
import { Enum } from '../../../../../../models/spec/orm/enum';
import { EnumOption } from '../../../../../../models/spec/orm/enum-option';
import { trackElement } from '../../../../../../utils/templates';

@Component({
  selector: 'spec-enum-edit',
  templateUrl: './enum-edit.component.html',
  styleUrls: ['./enum-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnumEditComponent implements OnInit {

  ui = UI;
  localUi = LocalUI;
  editMode = EditMode;
  trackElement = trackElement;

  @Input()
  mode = EditMode.view;

  enum: Enum;
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
      title: 'Option',
      name: 'option'
    });
    option.linking(this.enum);
    option.new();
    this.manager.put(option);

    this.enum.addOption(option);
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

}
