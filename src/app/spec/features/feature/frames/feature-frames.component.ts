import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PopoverInstance, PopoverService, UI } from '@junte/ui';
import { combineLatest, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { serialize } from 'serialize-ts';
import { Language } from 'src/enums/language';
import { Frame } from 'src/models/spec/planning/feature/frame';
import { CURRENT_LANGUAGE } from '../../../../../consts';
import { environment } from '../../../../../environments/environment';
import { UploadFigmaAssetRequest } from '../../../../../models/figma-asset';
import { Project } from '../../../../../models/project';
import { Feature } from '../../../../../models/spec/planning/feature/feature';
import { catchGQLErrors } from '../../../../../utils/gql-errors';
import { SpecManager } from '../../../managers/spec';
import { UploadFigmaAssetGQL } from './frames.graphql';

@Component({
  selector: 'spec-feature-frames',
  templateUrl: './feature-frames.component.html',
  styleUrls: ['./feature-frames.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeatureFramesComponent implements OnInit {

  ui = UI;
  language = Language;
  env = environment;
  consts = {language: CURRENT_LANGUAGE};
  i18n = {addFrame: $localize`:@@label.add_frame:Add frame`};

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

  constructor(private uploadFigmaAssetGQL: UploadFigmaAssetGQL,
              public manager: SpecManager,
              private popover: PopoverService,
              public cd: ChangeDetectorRef,
              private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.route.data.subscribe(({project, feature}) =>
      [this.project, this.feature] = [project, feature]);
  }

  add(frame: Frame) {
    this.reference.popover?.hide();

    frame.linking(this.feature);
    this.feature.addFrame(frame);
    this.manager.put(this.feature);

    this.cd.markForCheck();

    this.refresh(true);
  }

  remove(frame: Frame) {
    const links = frame.delete();
    links.deleted.forEach(o => this.manager.remove(o));
    links.changed.forEach(o => this.manager.put(o));
    this.manager.remove(frame);

    this.cd.markForCheck();
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
            .pipe(catchGQLErrors(), finalize(() => {
              this.manager.put(frame);
              this.cd.markForCheck();

              o.next();
              o.complete();
            }))
            .subscribe(({data: {response: {frame: {file: {url}}}}}) => {
                Object.assign(frame, {thumbnail: url});
                frame.error = null;
              },
              err => frame.error = err.toString());
        }));
      }
    }

    if (queue.length > 0) {
      this.progress.refreshing = true;
      combineLatest(queue)
        .pipe(finalize(() => this.progress.refreshing = false))
        .subscribe(() => null);
    }
  }

}
