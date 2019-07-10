import { HttpClient } from '@angular/common/http';
import { ComponentFactoryResolver, Injectable, Injector } from '@angular/core';
import { SpaceSyncComponent } from 'app/space/modals/sync/space-sync.component';
import { Persistence, SerializeType } from 'decorators/persistence';
import { EditMode } from 'enums/edit-mode';
import { ModalService } from 'junte-ui';
import { Space } from 'model/space';
import PouchDB from 'pouchdb-browser';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { bufferTime, filter, finalize, map, tap } from 'rxjs/operators';
import { deserialize } from 'serialize-ts';
import Database = PouchDB.Database;

interface Flush {
    object: Persistence;
}

class Put implements Flush {
    constructor(public object: Persistence) {

    }
}

class Remove implements Flush {
    constructor(public object: Persistence) {

    }
}

@Injectable()
export class SpaceManager {

    private local: Database = null;
    private remote: Database = null;
    private space$: BehaviorSubject<Space>;
    private flushing$ = new Subject<Flush>();

    mode: EditMode = EditMode.view;

    get space() {
        return this.space$.getValue();
    }

    set space(space: Space) {
        this.space$.next(space);
    }

    constructor(private modalService: ModalService,
                private injector: Injector,
                private cfr: ComponentFactoryResolver,
                private http: HttpClient) {
        console.log('instance');
        this.flushing();
    }

    import(project: string, progress = new Subject()): Observable<Space> {
        return new Observable(observer => {
            this.http.get('space.json')
                .pipe(map((obj: any) => {
                        for (const actor of obj.actors) {
                            for (const feature of  actor.features) {
                                for (const entry of  feature.story) {
                                    if (!!entry.see) {
                                        entry.type = 'see';
                                        entry.description = entry.see;
                                    }
                                    if (!!entry.can) {
                                        entry.type = 'can';
                                        entry.description = entry.can;
                                    }
                                }
                            }
                        }

                        return deserialize(obj, Space);
                    }),
                    tap(space => space.linking()))
                .subscribe((space: Space) => {
                    this.local = new PouchDB(project);
                    space.import(this.local, progress)
                        .pipe(finalize(() => observer.complete()))
                        .subscribe(() => observer.next(space));
                });
        });
    }

    get(project: string, id: string): Observable<Space> {
        if (!this.space$) {
            this.space$ = new BehaviorSubject<Space>(null);

            const component = this.cfr.resolveComponentFactory(SpaceSyncComponent).create(this.injector);
            this.modalService.open(component);

            this.local = new PouchDB(project, {auto_compaction: true});
            this.remote = new PouchDB('https://specprojector.com:5984/' + project);

            this.local.sync(this.remote)
                .on('complete', () => {
                    console.log('synced');

                    const space = new Space();
                    space.id = id;
                    const progress = new Subject();
                    space.load(this.local, progress)
                        .pipe(tap(() => space.linking()))
                        .subscribe(() => {
                            console.log(space);
                            this.space$.next(space);
                            this.pull();
                            this.push();

                            setTimeout(() => this.modalService.close(), 1000);
                        }, err => this.space$.error(err));
                }).on('error',
                err => this.space$.error(err));
        }

        return new Observable(o => {
            this.space$.pipe(filter(s => !!s))
                .subscribe(space => {
                    o.next(space);
                    o.complete();
                }, err => o.error(err));
        });
    }

    put(object: Persistence) {
        // console.log('putting');
        this.flushing$.next(new Put(object));
    }

    remove(object: Persistence) {
        console.log('deleting');
        this.flushing$.next(new Remove(object));
    }

    private pull() {
        console.log('start pull');
        this.local.replicate.from(this.remote, {
            live: true,
            retry: true
        }).on('change', (changes) => {
            console.log('changes from server');
            console.log(changes.docs);
            const space = this.space$.getValue();
            const progress = new Subject();
            progress.subscribe(ref => {
                console.log('updated');
                console.log(ref);
            });

            for (const doc of changes.docs) {
                space.update(this.local, progress, doc)
                    .subscribe(() => null);
            }
        });
    }

    private push() {
        console.log('start push');
        this.local.replicate.to(this.remote, {
            live: true,
            retry: true
        });
    }

    private flushing() {
        this.flushing$.pipe(bufferTime(2500),
            filter(buffer => buffer.length > 0))
            .subscribe(buffer => {
                const puts = new Map<string, Put>(),
                    removed = new Map<string, Remove>();

                for (const action of buffer) {
                    if (action instanceof Put) {
                        if (!puts.has(action.object.id)) {
                            puts.set(action.object.id, action);
                        }
                    } else if (action instanceof Remove) {
                        if (!removed.has(action.object.id)) {
                            removed.set(action.object.id, action);
                        }
                    }
                }

                const docs = [];
                for (const action of Array.from(puts.values())) {
                    const object = action.object;
                    if (object.dirty()) {
                        docs.push(object.serialize(SerializeType.reference));
                    } else {
                        console.log('object it not dirty');
                    }
                }

                for (const action of Array.from(removed.values())) {
                    const obj = action.object.serialize(SerializeType.reference);
                    obj['deleted'] = true;
                    docs.push(obj);
                }

                if (docs.length) {
                    console.log('send to server');
                    console.log(docs);
                    this.local.bulkDocs(docs)
                        .then((updates => {
                            for (const update of updates) {
                                if (puts.has(update.id)) {
                                    const action = puts.get(update.id);
                                    action.object.rev = update.rev;
                                    action.object.flush();
                                }
                            }
                        })).catch(err => console.log(err));
                }
            });
    }

}
