import { ComponentFactoryResolver, Injectable, Injector } from '@angular/core';
import { ModalOptions, ModalService, UI } from '@junte/ui';
import PouchDB from 'pouchdb-browser';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { bufferTime, filter, finalize, tap } from 'rxjs/operators';
import { EditMode } from 'src/enums/edit-mode';
import { Spec } from 'src/model/spec/spec';
import { Persistence, SerializeType } from 'src/decorators/persistence';
import { AppConfig } from '../app/app-config';
import { SpaceSyncComponent } from '../app/shared/sync/space-sync.component';
import { environment } from '../environments/environment';
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

@Injectable()
export class SpecManager {

  private local: Database;
  private remote: Database;
  private flushing$ = new Subject<Flush>();
  spec$: BehaviorSubject<Spec>;
  mode: EditMode = EditMode.edit;

  get spec() {
    return this.spec$.getValue();
  }

  set spec(spec: Spec) {
    this.spec$.next(spec);
  }

  constructor(private cfr: ComponentFactoryResolver,
              private injector: Injector,
              private modal: ModalService,
              private config: AppConfig) {
    this.flushing();
  }

  get(project: string): Observable<Spec> {
    if (!this.spec$) {
      this.spec$ = new BehaviorSubject<Spec>(null);
      this.local = new PouchDB(project,
        {
          auto_compaction: true
        });
      console.log(environment.storage);
      this.remote = new PouchDB(`${environment.storage}/${project}`,
        {
          skip_setup: true,
          fetch: (url, opts) => {
            const headers = opts.headers as Headers;
            headers.append('Authorization', this.config.authorization.key);
            return PouchDB.fetch(url, opts);
          }
        });

      const component = this.cfr.resolveComponentFactory(SpaceSyncComponent).create(this.injector);
      try {
        this.modal.open(component, ({
          title: {text: 'Syncing project'},
          hold: true
        }));
      } catch {
      }

      this.local.sync(this.remote).on('complete', () => {
        const spec = new Spec();
        console.group('get');
        console.log(project);
        console.log('synced');
        console.log(spec);
        console.groupEnd();
        spec.id = SPEC_OBJECT_ID;
        const progress = new Subject();
        spec.load(this.local, progress)
          .pipe(finalize(() => {
            this.spec = spec;
            try {
              this.modal.close();
            } catch {
            }
          }), tap(() => spec.linking()))
          .subscribe(() => {
            this.pull();
            this.push();
          }, (err: { status }) => {
            console.log(err);
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

  destroy() {
    // this.local.destroy();
    // this.remote.destroy();
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
