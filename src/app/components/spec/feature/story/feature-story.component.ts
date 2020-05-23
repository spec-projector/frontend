import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UI } from 'junte-ui';
import { NGXLogger } from 'ngx-logger';
import { SpecManager } from 'src/app/managers/spec.manager';
import { EditMode } from 'src/app/model/enums/edit-mode';
import { Feature, StoryEntry, StoryEntryType } from 'src/app/model/spec/planning/feature';
import { TextToken } from 'src/app/model/spec/planning/token';

@Component({
  selector: 'spec-feature-story',
  templateUrl: './feature-story.component.html',
  styleUrls: ['./feature-story.component.scss']
})
export class FeatureStoryComponent implements OnInit {

  ui = UI;
  mode = EditMode.view;
  editMode = EditMode;

  feature: Feature;

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
  }

  edit(index: number, entry: StoryEntry) {
    this.feature.story[index] = entry;
    this.save();
  }

  delete(index: number) {
    this.feature.story.splice(index, 1);
    this.save();
  }

  save() {
    this.logger.log('save story for feature [', this.feature.title.toString(), ']');
    this.manager.put(this.feature);

    this.feature.version++;
  }

}
