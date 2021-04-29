import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PopoverInstance, PopoverService, UI } from '@junte/ui';
import { NGXLogger } from 'ngx-logger';
import { combineLatest, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { serialize } from 'serialize-ts';
import { Language } from 'src/enums/language';
import { Frame } from 'src/models/spec/planning/feature/frame';
import { environment } from '../../../../../environments/environment';
import { SpecManager } from '../../../managers';
import { UploadFigmaAssetRequest } from '../../../../../models/figma-asset';
import { Project } from '../../../../../models/projects';
import { Feature } from '../../../../../models/spec/planning/feature/feature';
import { catchGQLErrors } from '../../../../../utils/gql-errors';
import { UploadFigmaAssetGQL } from './frames.graphql';

@Component({
  selector: 'spec-feature-frames',
  templateUrl: './feature-frames.component.html',
  styleUrls: ['./feature-frames.component.scss']
})
export class FeatureFramesComponent implements OnInit {

  ui = UI;
  language = Language;
  env = environment;

  private _feature: Feature;

  progress = {refreshing: false};
  reference: { popover: PopoverInstance } = {popover: null};
  project: Project;

  set feature(feature: Feature) {
    this._feature = feature;
    this.refresh();
  }

  get feature() {
    return this._feature;
  }

  constructor(@Inject(LOCALE_ID) public locale: string,
              private uploadFigmaAssetGQL: UploadFigmaAssetGQL,
              public manager: SpecManager,
              private popover: PopoverService,
              private route: ActivatedRoute,
              private logger: NGXLogger) {

  }

  ngOnInit() {
    this.route.data.subscribe(({project, feature}) =>
      [this.project, this.feature] = [project, feature]);
  }

  add(frame: Frame) {
    this.reference.popover?.hide();
    this.feature.frames.push(frame);
    this.save();

    this.refresh(true);
  }

  remove(index: number) {
    this.feature.frames.splice(index, 1);
    this.save();
  }

  refresh(force = false) {
    const queue = [];
    for (const frame of this.feature.frames) {
      if (force || !frame.thumbnail) {
        queue.push(new Observable<string>(o => {
          const request = new UploadFigmaAssetRequest({
            project: this.project.id,
            url: frame.url
          });
          this.uploadFigmaAssetGQL.mutate({input: serialize(request)})
            .pipe(catchGQLErrors())
            .subscribe(({data: {response: {frame: {file}}}}) => {
              frame.thumbnail = file;
              o.next();
              o.complete();
            }, err => o.error(err));
        }));
      }
    }

    if (queue.length > 0) {
      this.progress.refreshing = true;
      combineLatest(queue)
        .pipe(finalize(() => this.progress.refreshing = false))
        .subscribe(() => this.save());
    }
  }

  save() {
    this.logger.log('save frames for feature [', this.feature.title.toString(), ']');
    this.manager.put(this.feature);

    this.feature.version++;
  }

}
