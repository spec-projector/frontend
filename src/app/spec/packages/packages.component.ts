import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {Component, Inject, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SpecManager} from 'src/managers/spec.manager';
import {EditMode} from 'src/enums/edit-mode';
import {PopoverInstance, UI} from '@junte/ui';
import {Package} from 'src/model/spec/orm/package';
import {Spec} from 'src/model/spec/spec';
import {LocalUI} from '../../../enums/local-ui';
import {Language} from '../../../enums/language';
import {generate as shortid} from 'shortid';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'spec-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.scss']
})
export class PackagesComponent implements OnInit, OnDestroy {

  ui = UI;
  localUi = LocalUI;
  editMode = EditMode;
  language = Language;

  private destroyed = new Subject();

  spec: Spec;
  instance: { popover: PopoverInstance } = {popover: null};

  constructor(@Inject(LOCALE_ID) public locale: string,
              public manager: SpecManager,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.data.pipe(takeUntil(this.destroyed))
      .subscribe(({spec}) => this.spec = spec);
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  addPackage() {
    const pack = new Package({
      id: shortid(),
      name: 'package',
      title: 'Package'
    });
    this.spec.packages.unshift(pack);

    this.manager.put(pack);
    this.manager.put(this.spec);
  }

  deletePackage(index: number) {
    const pack = this.spec.packages[index];
    this.spec.packages.splice(index, 1);

    this.manager.remove(pack);
    this.manager.put(this.spec);

  }

  movePackage(event: CdkDragDrop<Package[]>) {
    moveItemInArray(this.spec.packages, event.previousIndex, event.currentIndex);
    this.manager.put(this.spec);
  }

  trackPackage(index: number, pack: Package) {
    return !!pack ? pack.id : null;
  }
}
