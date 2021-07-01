import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UI } from '@junte/ui';
import { NGXLogger } from 'ngx-logger';
import { SpecManager } from 'src/app/spec/managers/spec';
import { EditMode } from 'src/enums/edit-mode';
import { Language } from 'src/enums/language';
import { Feature } from 'src/models/spec/planning/feature/feature';
import { AccentToken, TextToken } from 'src/models/spec/planning/token';
import { CURRENT_LANGUAGE } from '../../../../../consts';
import { StoryEntry, StoryEntryType } from '../../../../../models/spec/planning/feature/story';
import { FeatureStoryEntryComponent } from './entry/story-entry.component';
import { AnalyticsType } from 'src/enums/analyticsType';

@Component({
  selector: 'spec-feature-story',
  templateUrl: './feature-story.component.html',
  styleUrls: ['./feature-story.component.scss']
})
export class FeatureStoryComponent implements OnInit {

  ui = UI;
  editMode = EditMode;
  language = Language;
  storyEntryType = StoryEntryType;
  consts = {language: CURRENT_LANGUAGE};
  analyticsType = AnalyticsType;

  feature: Feature;

  @ViewChildren('storyEntry')
  entries: QueryList<FeatureStoryEntryComponent>;

  constructor(public manager: SpecManager,
              private route: ActivatedRoute,
              private logger: NGXLogger) {
  }

  ngOnInit() {
    this.route.data.subscribe(({feature}) => this.feature = feature);
  }

  fill() {
    this.feature.story.push(new StoryEntry({
      type: StoryEntryType.see,
      description: [new TextToken('palm with '), new AccentToken('bananas')]
    }));
    this.feature.story.push(new StoryEntry({
      type: StoryEntryType.can,
      description: [new AccentToken('rip off'), new TextToken(' any banana')]
    }));
    this.save();
  }

  add(index: number) {
    const entry = new StoryEntry({
      type: StoryEntryType.see,
      description: [new TextToken('something...')]
    });
    this.feature.story.splice(index + 1, 0, entry);
    this.save();

    this.focus(-1, index + 1);
  }

  edit(index: number, entry: StoryEntry) {
    this.feature.story[index] = entry;
    this.save();
  }

  delete(index: number) {
    this.feature.story.splice(index, 1);
    this.save();

    this.focus(-1, index - 1);
  }

  focus(current: number, index: number) {
    setTimeout(() => {
      const entries = this.entries.toArray();
      if (entries.length > 0) {
        if (current >= 0) {
          entries[current].unfocus();
        }
        const move = Math.min(Math.max(index, 0), entries.length - 1);
        entries[move].focus();
      }
    }, 50);
  }

  save() {
    this.logger.log('save story for feature [', this.feature.title.toString(), ']');
    this.manager.put(this.feature);
  }

}
