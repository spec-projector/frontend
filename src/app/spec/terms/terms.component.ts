import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalService, UI } from '@junte/ui';
import { SpecManager } from 'src/app/spec/managers';
import { EditMode } from 'src/enums/edit-mode';
import { Language } from 'src/enums/language';
import { Spec } from 'src/models/spec/spec';
import { CURRENT_LANGUAGE } from '../../../consts';
import { LocalUI } from '../../../enums/local-ui';
import { Term } from '../../../models/spec/planning/term';
import { TextToken } from '../../../models/spec/planning/token';
import { trackElement } from '../../../utils/templates';

@Component({
  selector: 'spec-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TermsComponent implements OnInit {

  ui = UI;
  language = Language;
  localUi = LocalUI;
  editMode = EditMode;
  trackElement = trackElement;
  consts = {language: CURRENT_LANGUAGE};

  spec: Spec;
  version = 0;
  added: string;

  constructor(public manager: SpecManager,
              public modal: ModalService,
              public cd: ChangeDetectorRef,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.data.subscribe(({spec}) => this.spec = spec);
  }

  addTerm() {
    const term = new Term({
      title: $localize`:@@label.new_term_title:Products cart`,
      description: [new TextToken($localize`:@@message.new_term_description:Place in user interface where displayed products for client purchasing.`)]
    });
    term.linking(this.spec);
    term.new();
    this.manager.put(term);

    this.spec.addTerm(term);
    this.manager.put(this.spec);

    this.added = term.id;
    this.version++;
    this.cd.detectChanges();
  }

  deleteTerm(term: Term) {
    const links = term.delete();
    links.deleted.forEach(o => this.manager.remove(o));
    links.changed.forEach(o => this.manager.put(o));
    this.manager.remove(term);

    this.version++;
    this.cd.detectChanges();
    this.modal.close();
  }

  moveTerm(event: CdkDragDrop<Term[]>) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    this.manager.put(this.spec);

    this.version++;
    this.cd.detectChanges();
  }

}
