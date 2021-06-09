import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import PouchDB from 'pouchdb-browser';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { bufferTime, filter, finalize, tap } from 'rxjs/operators';
import { Persistence, SerializeType } from 'src/decorators/persistence';
import { EditMode } from 'src/enums/edit-mode';
import { ResourceType, Spec, SPEC_DOC_ID } from 'src/models/spec/spec';
import { CURRENT_LANGUAGE, SCHEME_VERSION } from '../../consts';
import { Language } from '../../enums/language';
import { environment } from '../../environments/environment';
import { SchemeInvalidError } from '../../types/errors';
import { AppConfig } from '../app-config';
import { ReplicationState } from './enums';
import inMemoryPlugin from 'pouchdb-adapter-memory';
import { generate } from 'shortid';

PouchDB.plugin(inMemoryPlugin);
import Database = PouchDB.Database;

const BUFFER_TIME = 2500;

interface Commit {
  obj: Persistence;
}

class Put implements Commit {
  constructor(public obj: Persistence) {

  }
}

class Remove implements Commit {
  constructor(public obj: Persistence) {

  }
}

export function createSpec(spec: Spec): Persistence[] {
  const links = spec.new();

  switch (CURRENT_LANGUAGE) {
    case Language.ru:
      spec.resourceTypes = [
        new ResourceType({title: 'UI/UX', hourRate: 1000}),
        new ResourceType({title: 'Фронтенд', hourRate: 2000}),
        new ResourceType({title: 'Бекенд', hourRate: 2000})
      ];
      break;
    case Language.en:
    default:
      spec.resourceTypes = [
        new ResourceType({title: 'UI/UX', hourRate: 15}),
        new ResourceType({title: 'Frontend', hourRate: 30}),
        new ResourceType({title: 'Backend', hourRate: 30})
      ];
  }

  links.push(spec);
  return links;
}

interface Replication {
  cancel: () => void;
}

@Injectable({providedIn: 'root'})
export class SpecManager {

  private db: { local?: Database, remote?: Database } = {};
  private replicate: { pull?: Replication, push?: Replication } = {};
  private committing$ = new Subject<Commit>();

  spec$: BehaviorSubject<Spec>;

  state = new (class {
    remote$ = new BehaviorSubject(ReplicationState.done);

    set remote(state: ReplicationState) {
      this.remote$.next(state);
    }

    get remote() {
      return this.remote$.getValue();
    }

    dirty$ = new BehaviorSubject(0);

    set dirty(dirty: number) {
      this.dirty$.next(dirty);
    }

    get dirty() {
      return this.dirty$.getValue();
    }
  });

  mode$ = new BehaviorSubject(EditMode.edit);

  set mode(mode: EditMode) {
    this.mode$.next(mode);
  }

  get mode() {
    return this.mode$.getValue();
  }

  constructor(private config: AppConfig,
              private logger: NGXLogger) {
    this.logger.info('create instance');
    this.committing$.pipe(tap(() => this.state.dirty++),
      bufferTime(BUFFER_TIME),
      tap(buffer => this.state.dirty -= buffer.length),
      filter(buffer => buffer.length > 0))
      .subscribe(buffer => this.commit(buffer));
  }

  get(project: string): Observable<Spec> {
    if (!this.spec$) {
      this.spec$ = new BehaviorSubject<Spec>(null);
      this.db.local = new PouchDB(generate(),
        {
          adapter: 'memory',
          auto_compaction: true
        });
      this.db.remote = new PouchDB([environment.storage, project].join('/'),
        {
          skip_setup: false,
          auto_compaction: true,
          fetch: (url, opts) => {
            opts.credentials = 'omit';
            const headers = opts.headers as Headers;
            if (!!this.config.token) {
              headers.append('Authorization', `Bearer ${this.config.token.key}`);
            }
            return PouchDB.fetch(url, opts);
          }
        });

      this.db.local.sync(this.db.remote)
        .on('complete', () => {
          const spec = new Spec();
          this.logger.log(project);
          this.logger.log('synced');
          this.startPull();
          this.startPush();
          spec.id = SPEC_DOC_ID;
          const progress = new Subject();
          spec.load(this.db.local, progress)
            .subscribe(() => {
              // TODO: remove this soon
              spec.scheme.version = SCHEME_VERSION;
              this.put(spec);
              if (spec.scheme.version !== SCHEME_VERSION) {
                this.spec$.error(new SchemeInvalidError());
                return;
              }

              spec.linking();
              console.log(spec);

              if (!spec.model.id) {
                spec.model.new();
                this.put(spec.model);
                this.put(spec);
              }

              if (!spec.tools.id) {
                spec.tools.new();
                this.put(spec.tools);
                this.put(spec);
              }

              this.spec$.next(spec);
            }, (err: { status, docId }) => {
              this.logger.error(err);
              if (err.status === 404) {
                if (err.docId === SPEC_DOC_ID) {
                  createSpec(spec).forEach(o => this.put(o));
                }

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
          this.logger.log('return');
          observer.next(spec);
          observer.complete();
        }, err => {
          this.spec$ = null;
          observer.error(err);
        });
    });
  }

  put(object: Persistence) {
    object.updated();
    this.logger.info('put');
    this.committing$.next(new Put(object));
  }

  remove(object: Persistence) {
    object.updated();
    this.logger.info('remove');
    this.committing$.next(new Remove(object));
  }

  private startPull() {
    this.logger.info('start pull from server');
    this.replicate.pull?.cancel();
    this.replicate.pull = this.db.local.replicate.from(this.db.remote, {
      live: true,
      retry: true
    }).on('change', (changes) => {
      this.logger.info('changes from server', changes.docs);
      const progress = new Subject();
      progress.subscribe(ref => {
        this.logger.info('updated');
        // console.log(ref);
      });

      const spec = this.spec$.getValue();
      for (const doc of changes.docs) {
        spec.replicate(this.db.local, progress, doc)
          .subscribe(() => null);
      }
    });
  }

  private startPush() {
    this.logger.info('start push');
    this.replicate.push?.cancel();
    this.replicate.push = this.db.local.replicate.to(this.db.remote, {
      live: true,
      retry: true,
    }).on('active', () => {
      this.logger.info('replication active');
      this.state.remote = ReplicationState.active;
    }).on('change', info => {
      this.logger.info('replication change', info);
      this.state.remote = ReplicationState.done;
    }).on('error', error => {
      this.logger.error('replication error', error);
      this.state.remote = ReplicationState.error;
    }).on('denied', denied => {
      this.logger.error('replication denied', denied);
      this.state.remote = ReplicationState.error;
    }).on('paused', info => {
      this.logger.info('replication paused', info);
      this.state.remote = ReplicationState.paused;
    }).on('complete', info => {
      this.logger.info('replication complete', info);
      this.state.remote = ReplicationState.paused;
    });
  }

  commit(buffer: Commit[]) {
    this.logger.info('committing', buffer);
    const puts = new Map<string, Put>(),
      removed = new Map<string, Remove>();

    for (const action of buffer) {
      if (action instanceof Put) {
        if (!puts.has(action.obj.id)) {
          puts.set(action.obj.id, action);
        }
      } else if (action instanceof Remove) {
        if (!removed.has(action.obj.id)) {
          removed.set(action.obj.id, action);
        }
      }
    }

    const docs = [];
    for (const action of Array.from(puts.values())) {
      const object = action.obj;
      if (object.dirty() && !removed.has(action.obj.id)) {
        docs.push(object.serialize(SerializeType.reference));
      } else {
        this.logger.info('object it not dirty');
      }
    }

    for (const action of Array.from(removed.values())) {
      const obj = action.obj.serialize(SerializeType.reference);
      obj['_deleted'] = true;
      docs.push(obj);
      console.log('deleting!');
    }

    if (docs.length > 0) {
      this.logger.info('committing', docs);
      this.db.local.bulkDocs(docs)
        .then((updates => {
          for (const update of updates) {
            if (puts.has(update.id)) {
              const action = puts.get(update.id);
              action.obj.rev = update.rev;
              action.obj.flush();
            }
          }
        })).catch(err => this.logger.error(err));
    }
  }

  clear() {
    this.replicate.pull?.cancel();
    this.replicate.push?.cancel();
    this.spec$ = null;
  }

  dump(): Observable<any[]> {
    return new Observable(o => {
      this.db.local.allDocs({include_docs: true})
        .then(({rows}: { rows: any[] }) => {
          o.next(rows.filter(({doc: {deleted}}) => !deleted)
            .map(({doc}) => doc));
          o.complete();
        });
    });
  }

  restore(docs: { _id: string }[]): Observable<number> {
    return new Observable(o => {
      this.db.local.allDocs()
        .then(({rows}: { rows: { id: string, value: { rev: string } }[] }) => {
          const revs = new Map();
          for (const doc of rows) {
            this.logger.log(doc);
            revs.set(doc.id, doc.value.rev);
          }

          for (const doc of docs) {
            doc['_rev'] = revs.get(doc._id);
          }
          this.db.local.bulkDocs(docs)
            .then(res => {
              this.logger.log(res);
              o.next(docs.length);
              o.complete();
            });

        });
    });
  }

}
