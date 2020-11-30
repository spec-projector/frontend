import { Component, ContentChildren, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UI } from '@junte/ui';
import { NGXLogger } from 'ngx-logger';
import { SpecManager } from 'src/app/managers/spec.manager';
import { EditMode } from 'src/app/model/enums/edit-mode';
import { Feature, StoryEntry, StoryEntryType } from 'src/app/model/spec/planning/feature';
import { TextToken } from 'src/app/model/spec/planning/token';
import { StoryEntryComponent } from './entry/story-entry.component';

@Component({
  selector: 'spec-feature-story',
  templateUrl: './feature-story.component.html',
  styleUrls: ['./feature-story.component.scss']
})
export class FeatureStoryComponent implements OnInit {

  ui = UI;
  editMode = EditMode;

  feature: Feature;

  @ViewChildren('storyEntry')
  entries!: QueryList<StoryEntryComponent>;

  constructor(public manager: SpecManager,
              private route: ActivatedRoute,
              private logger: NGXLogger) {
  }

  ngOnInit() {
    this.route.data.subscribe(({feature}) => this.feature = feature);
  }

  fill() {
    const entry = new StoryEntry({
      type: StoryEntryType.see,
      description: [new TextToken('something...')]
    });
    this.feature.story.push(entry);
    this.save();
  }

  add(index: number) {
    const entry = new StoryEntry({
      type: StoryEntryType.see,
      description: [new TextToken('something...')]
    });
    this.feature.story.splice(index + 1, 0, entry);
    this.save();

    this.focus(index + 1);
  }

  edit(index: number, entry: StoryEntry) {
    this.feature.story[index] = entry;
    this.save();
  }

  delete(index: number) {
    this.feature.story.splice(index, 1);
    this.save();

    this.focus(index - 1);
  }

  focus(index: number) {
    setTimeout(() => {
      const entries = this.entries.toArray();
      if (entries.length > 0) {
        const move = Math.min(Math.max(index, 0), entries.length - 1);
        entries[move].focus();
      }
    }, 50);
  }

  save() {
    this.logger.log('save story for feature [', this.feature.title.toString(), ']');
    this.manager.put(this.feature);

    this.feature.version++;
  }

}
