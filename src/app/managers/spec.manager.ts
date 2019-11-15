import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb-browser';
import replication from 'pouchdb-replication-stream';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { bufferTime, filter, finalize, tap } from 'rxjs/operators';
import { EditMode } from 'src/app/model/enums/edit-mode';
import { Spec } from 'src/app/model/spec/spec';
import { Persistence, SerializeType } from 'src/decorators/persistence';
import Database = PouchDB.Database;

const BUFFER_TIME = 2500;

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
export class SpecManager {

    private local: Database = null;
    private remote: Database = null;
    private flushing$ = new Subject<Flush>();
    spec$: BehaviorSubject<Spec>;
    mode: EditMode = EditMode.view;

    get spec() {
        return this.spec$.getValue();
    }

    set spec(spec: Spec) {
        this.spec$.next(spec);
    }

    constructor() {
        this.flushing();
    }

    import(project: string, progress = new Subject(), obj: any = null): Observable<Spec> {
        this.spec$ = new BehaviorSubject<Spec>(null);
        this.local = new PouchDB(`project_${project}`, {auto_compaction: true});
        this.remote = new PouchDB('https://specprojector.com:5984/' + `project_${project}`);

        this.local.sync(this.remote)
            .on('complete', () => {
                const spec = new Spec().deserialize(obj) as Spec;
                console.group(`import`);
                console.log(`project_${project}`);
                console.log('synced');
                console.log(obj);
                console.log(spec);
                console.groupEnd();
                spec.id = project;
                spec.import(this.local, progress, `project_${project}`)
                    .pipe(finalize(() => this.spec = spec), tap(() => spec.linking()))
                    .subscribe(() => {
                        this.pull();
                        this.push();
                    }, (err: { status }) => {
                        if (err.status === 404) {
                            console.log('spec not found!');
                        } else {
                            this.spec$.error(err);
                        }
                    });
            })
            .on('error', err => this.spec$.error(err));

        return new Observable(observer => {
            this.spec$.pipe(filter(spec => !!spec))
                .subscribe(spec => {
                    observer.next(spec);
                    observer.complete();
                }, err => observer.error(err));
        });
    }

    get(project: string): Observable<Spec> {
        if (!this.spec$) {
            this.spec$ = new BehaviorSubject<Spec>(null);
            this.local = new PouchDB(project, {auto_compaction: true});
            this.remote = new PouchDB('https://specprojector.com:5984/' + project);

            this.local.sync(this.remote).on('complete', () => {
                const spec = new Spec();
                console.group('get');
                console.log(`project_${project}`);
                console.log('synced');
                console.log(spec);
                console.groupEnd();
                spec.id = project;
                const progress = new Subject();
                spec.load(this.local, progress)
                    .pipe(finalize(() => this.spec = spec), tap(() => spec.linking()))
                    .subscribe(() => {
                        this.pull();
                        this.push();
                    }, (err: { status }) => {
                        if (err.status === 404) {
                            console.log('spec not found!');
                        } else {
                            this.spec$.error(err);
                        }
                    });
            }).on('error', err => this.spec$.error(err));
        }

        return new Observable(observer => {
            this.spec$.pipe(filter(spec => !!spec))
                .subscribe(spec => {
                    console.log('return');
                    observer.next(spec);
                    observer.complete();
                }, err => observer.error(err));
        });
    }

    put(object: Persistence) {
        this.flushing$.next(new Put(object));
    }

    remove(object: Persistence) {
        console.log('deleting');
        this.flushing$.next(new Remove(object));
    }

    clear() {
        this.spec$ = null;
        this.local = null;
        this.remote = null;
    }

    private pull() {
        console.log('start pull');
        this.local.replicate.from(this.remote, {
            live: true,
            retry: true
        }).on('change', (changes) => {
            console.log('changes from server');
            console.log(changes.docs);
            const spec = this.spec$.getValue();
            const progress = new Subject();
            progress.subscribe(ref => {
                console.log('updated');
                console.log(ref);
            });

            for (const doc of changes.docs) {
                spec.update(this.local, progress, doc)
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

    flushing() {
        this.flushing$.pipe(bufferTime(BUFFER_TIME), filter(buffer => buffer.length > 0))
            .subscribe(buffer => {
                console.log('flushing');
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

    dump(): Observable<any> {
        return new Observable(o => {
            this.local.allDocs({include_docs: true})
                .then(docs => {
                    o.next(docs.rows.map(({doc}) => doc));
                    o.complete();
                });
        });
    }

}
