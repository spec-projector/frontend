import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb-browser';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { bufferTime, filter, finalize } from 'rxjs/operators';
import { generate as shortid } from 'shortid';
import { Persistence, SerializeType } from 'src/decorators/persistence';
import { EditMode } from 'src/enums/edit-mode';
import { SpecModel, Spec } from 'src/models/spec/spec';
import { SCHEME_VERSION } from '../../consts';
import { environment } from '../../environments/environment';
import { AppConfig } from '../app-config';
import Database = PouchDB.Database;

const SPEC_OBJECT_ID = 'spec';
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

  private local: Database;
  private remote: Database;
  private flushing$ = new Subject<Flush>();
  spec$: BehaviorSubject<Spec>;

  set mode(mode: EditMode) {
    this.mode$.next(mode);
  }

  get mode() {
    return this.mode$.getValue();
  }

  mode$ = new BehaviorSubject(EditMode.edit);

  constructor(private config: AppConfig) {
    this.flushing();
  }

  get(project: string): Observable<Spec> {
    if (!this.spec$) {
      this.spec$ = new BehaviorSubject<Spec>(null);
      this.local = new PouchDB(project,
        {
          auto_compaction: true
        });
      this.remote = new PouchDB(`${environment.storage}/${project}`,
        {
          skip_setup: false,
          fetch: (url, opts) => {
            const headers = opts.headers as Headers;
            if (!!this.config.token) {
              opts.credentials = 'omit';
              headers.append('Authorization', `Bearer ${this.config.token.key}`);
            }
            return PouchDB.fetch(url, opts);
          }
        });

      this.local.sync(this.remote)
        .on('complete', () => {
          const spec = new Spec();
          console.group('get');
          console.log(project);
          console.log('synced');
          console.log(spec);
          console.groupEnd();
          spec.id = SPEC_OBJECT_ID;
          const progress = new Subject();
          spec.load(this.local, progress)
            .subscribe(() => {
              // if (spec.scheme.version !== SCHEME_VERSION) {
              //  this.spec$.error(new SchemeInvalidError());
              //  return;
              // }

              spec.linking();
              this.spec$.next(spec);
              this.pull();
              this.push();
            }, (err: { status }) => {
              if (err.status === 404) {
                console.log('spec not found');
                const model = new SpecModel({
                  id: shortid()
                });
                this.put(model);
                spec.scheme.version = SCHEME_VERSION;
                spec.model = model;
                this.put(spec);

                this.spec$.next(spec);
              } else {
                this.spec$.error(err);
              }
            });
        }).on('error', err => this.spec$.error(err));
    }

    return new Observable(observer => {
      this.spec$.pipe(finalize(() => observer.complete()),
        filter(spec => !!spec))
        .subscribe(spec => {
          console.log('return');
          observer.next(spec);
          observer.complete();
        }, err => {
          this.spec$ = null;
          observer.error(err);
        });
    });
  }

  put(object: Persistence) {
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
      const progress = new Subject();
      progress.subscribe(ref => {
        console.log('updated');
        console.log(ref);
      });

      const spec = this.spec$.getValue();
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

  clear() {
    this.spec$ = null;
  }

  dump(): Observable<any[]> {
    return new Observable(o => {
      this.local.allDocs({include_docs: true})
        .then(({rows}: { rows: any[] }) => {
          o.next(rows.filter(({doc: {deleted}}) => !deleted)
            .map(({doc}) => doc));
          o.complete();
        });
    });
  }

  restore(docs: any[]): Observable<number> {
    return new Observable(o => {
      this.local.allDocs()
        .then(({rows}: { rows: { id: string, value: { rev: string } }[] }) => {
          const revs = new Map();
          for (const doc of rows) {
            console.log(doc);
            revs.set(doc.id, doc.value.rev);
          }

          for (const doc of docs) {
            doc['_rev'] = revs.get(doc._id);
          }
          this.local.bulkDocs(docs)
            .then(res => {
              console.log(res);
              o.next(docs.length);
              o.complete();
            });

        });
    });
  }

}
