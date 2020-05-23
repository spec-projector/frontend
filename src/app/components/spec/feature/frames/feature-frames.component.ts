import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as Figma from 'figma-api';
import { PopoverService, UI } from 'junte-ui';
import { NGXLogger } from 'ngx-logger';
import { combineLatest, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Frame } from 'src/app/model/spec/planning/frame';
import { SpecManager } from '../../../../managers/spec.manager';
import { Feature } from '../../../../model/spec/planning/feature';

@Component({
  selector: 'spec-feature-frames',
  templateUrl: './feature-frames.component.html',
  styleUrls: ['./feature-frames.component.scss']
})
export class FeatureFramesComponent implements OnInit {

  ui = UI;

  private _feature: Feature;

  progress = {refreshing: false};

  set feature(feature: Feature) {
    this._feature = feature;
    this.refresh();
  }

  get feature() {
    return this._feature;
  }

  constructor(public manager: SpecManager,
              private popover: PopoverService,
              private route: ActivatedRoute,
              private logger: NGXLogger) {

  }

  ngOnInit() {
    this.route.data.subscribe(({feature}) => this.feature = feature);
  }

  add(frame: Frame) {
    this.feature.frames.push(frame);
    this.save();
    this.popover.hide();
  }

  remove(index: number) {
    this.feature.frames.splice(index, 1);
    this.save();
  }

  refresh(force = false) {
    const figmaKey = this.feature.spec.integration.figmaKey;
    if (!figmaKey) {
      return;
    }
    const figma = new Figma.Api({
      personalAccessToken: this.feature.spec.integration.figmaKey
    });

    const queue = [];
    for (const frame of this.feature.frames) {
      if (force || !frame.thumbnail) {
        queue.push(new Observable<string>(o => {
          figma.getImage(frame.file, {ids: frame.node, scale: 1.5, format: 'jpg'})
            .then(res => {
              if (!!res.err) {
                o.error(res.err);
              } else if (!!res.images) {
                frame.thumbnail = res.images[frame.node];
                o.next(frame.node);
              }
              o.complete();
            });
        }));
      }
    }

    this.progress.refreshing = true;
    combineLatest(queue)
      .pipe(finalize(() => this.progress.refreshing = false))
      .subscribe(() => this.save());
  }

  save() {
    this.logger.log('save frames for feature [', this.feature.title.toString(), ']');
    this.manager.put(this.feature);

    this.feature.version++;
  }

}
