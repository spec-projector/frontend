import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UI } from '@junte/ui';
import { filter } from 'rxjs/operators';
import { Issue } from 'src/models/spec/planning/feature/issue';
import { Spec } from 'src/models/spec/spec';
import { IssueSystem } from '../../../../../../enums/issue';

@Component({
  selector: 'spec-attach-issue',
  templateUrl: './attach-issue.component.html',
  styleUrls: ['./attach-issue.component.scss']
})
export class AttachIssueComponent implements OnInit {

  ui = UI;
  issueSystem = IssueSystem;

  @Input()
  spec: Spec;

  @Output()
  settings = new EventEmitter();

  @Output()
  attached = new EventEmitter<Issue>();

  urlControl = this.fb.control(null, [Validators.required]);

  form = this.fb.group({
    resource: [null, [Validators.required]],
    url: this.urlControl,
    system: [null, [Validators.required]]
  });

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.form.valueChanges
      .pipe(filter(({system}) => !system))
      .subscribe(({url}) => {
        if (/gitlab/.test(url)) {
          this.form.patchValue({system: IssueSystem.gitlab},
            {emitEvent: false});
        }
        if (/github/.test(url)) {
          this.form.patchValue({system: IssueSystem.github},
            {emitEvent: false});
        }
      });
  }

  attach() {
    const {resource, url, system} = this.form.getRawValue();
    this.attached.emit(new Issue({resource, url, system}));
  }

}
