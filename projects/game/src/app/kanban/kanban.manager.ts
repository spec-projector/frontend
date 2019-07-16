import { HttpClient } from '@angular/common/http';
import { ComponentFactoryResolver, Injectable, Injector } from '@angular/core';
import { ModalService } from 'junte-ui';
import PouchDB from 'pouchdb-browser';
import { Kanban } from 'projects/game/src/models/kanban';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { bufferTime, filter, finalize, map, tap } from 'rxjs/operators';
import { deserialize } from 'serialize-ts';
import { Persistence, SerializeType } from 'src/decorators/persistence';
import { EditMode } from 'src/enums/edit-mode';
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

@Injectable({providedIn: 'root'})
export class KanbanManager {

    private local: Database = null;
    private remote: Database = null;
    private kanban$: BehaviorSubject<Kanban>;
    private flushing$ = new Subject<Flush>();

    mode: EditMode = EditMode.view;

    get kanban() {
        return this.kanban$.getValue();
    }

    set kanban(kanban: Kanban) {
        this.kanban$.next(kanban);
    }

    constructor(private modalService: ModalService,
                private injector: Injector,
                private cfr: ComponentFactoryResolver,
                private http: HttpClient) {
        console.log('instance');
        this.flushing();
    }

    import(project: string, progress = new Subject()): Observable<Kanban> {
        return new Observable(observer => {
            this.http.get('assets/kanban.json')
                .pipe(map((obj: any) => deserialize(obj, Kanban)),
                    tap(kanban => kanban.linking()))
                .subscribe((kanban: Kanban) => {
                    this.local = new PouchDB(project);
                    kanban.import(this.local, progress)
                        .pipe(finalize(() => observer.complete()))
                        .subscribe(() => observer.next(kanban));
                });
        });
    }

    get(project: string, id: string): Observable<Kanban> {
        if (!this.kanban$) {
            this.kanban$ = new BehaviorSubject<Kanban>(null);

            // const component = this.cfr.resolveComponentFactory(SpaceSyncComponent).create(this.injector);
            // this.modalService.open(component);

            this.local = new PouchDB(project, {auto_compaction: true});
            this.remote = new PouchDB('https://specprojector.com:5984/' + project);

            this.local.sync(this.remote)
                .on('complete', () => {
                    console.log('synced');

                    const kanban = new Kanban();
                    kanban.id = id;
                    const progress = new Subject();
                    kanban.load(this.local, progress)
                        .pipe(tap(() => kanban.linking()))
                        .subscribe(() => {
                            console.log(kanban);
                            this.kanban$.next(kanban);
                            this.pull();
                            this.push();

                            // setTimeout(() => this.modalService.close(), 1000);
                        }, err => this.kanban$.error(err));
                }).on('error',
                err => this.kanban$.error(err));
        }

        return new Observable(o => {
            this.kanban$.pipe(filter(s => !!s))
                .subscribe(kanban => {
                    o.next(kanban);
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
            const kanban = this.kanban$.getValue();
            const progress = new Subject();
            progress.subscribe(ref => {
                console.log('updated');
                console.log(ref);
            });

            for (const doc of changes.docs) {
                kanban.update(this.local, progress, doc)
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
        this.flushing$.pipe(bufferTime(2500), filter(buffer => buffer.length > 0))
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
