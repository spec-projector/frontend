import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as Figma from 'figma-api';
import { PopoverService, UI } from 'junte-ui';
import { combineLatest, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Frame } from 'src/app/model/spec/planning/frame';
import { Spec } from 'src/app/model/spec/spec';

@Component({
    selector: 'spec-frames',
    templateUrl: './frames.component.html',
    styleUrls: ['./frames.component.scss']
})
export class FramesComponent {

    ui = UI;

    private _frames: Frame[] = [];

    progress = {refreshing: false};

    @Input()
    spec: Spec;

    @Input()
    set frames(frames: Frame[]) {
        this._frames = frames;
        this.refresh();
    }

    get frames() {
        return this._frames;
    }

    @Output()
    changed = new EventEmitter<Frame[]>();

    constructor(private popover: PopoverService) {

    }

    add(frame: Frame) {
        this.frames.push(frame);
        this.changed.emit(this.frames);
        this.popover.hide();
    }

    remove(index: number) {
        this.frames.splice(index, 1);
        this.changed.emit(this.frames);
    }

    refresh(force = false) {
        const figmaKey = this.spec.integration.figmaKey;
        if (!figmaKey) {
            return;
        }
        const figma = new Figma.Api({
            personalAccessToken: this.spec.integration.figmaKey
        });

        const queue = [];
        for (const frame of this.frames) {
            if (force || !frame.thumbnail) {
                queue.push(new Observable<string>(o => {
                    figma.getImage(frame.file, {ids: frame.node, scale: 1.5, format: 'png'})
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
            .subscribe(() => this.changed.emit(this.frames));
    }

}
