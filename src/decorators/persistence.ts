import 'reflect-metadata';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ArraySerializer, deserialize, Field, Model, ModelSerializer, Name, serialize, Serializer, Type } from 'serialize-ts';
import { characters, generate } from 'shortid';
import Document = PouchDB.Core.Document;
import Database = PouchDB.Database;

characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

export const persistence = Model;
export const PERSIST_METADATA_KEY = Symbol('persist_field_meta');

function deepEqual(x, y) {
  const ok = Object.keys, tx = typeof x, ty = typeof y;
  return x && y && tx === 'object' && tx === ty
    ? (ok(x).length === ok(y).length && ok(x).every(key => deepEqual(x[key], y[key])))
    : (x === y);
}

interface FieldConfig {
  name?: string;
  type?: any;
  serializer?: Serializer<any>;
}

class FieldMetadata {
  property?: string;
  persistence = false;
  serializer: Serializer<any>;
  reference: Serializer<any>;
}

export enum SerializeType {
  default = 'default',
  reference = 'reference'
}

@persistence()
export class Reference {

  @persist({name: '_id'})
  id: string;
}

export function persist(config: FieldConfig = {}) {
  return function (obj: Object, property: string) {
    const metadata: FieldMetadata = new FieldMetadata();
    metadata.property = property;

    if (!!config.name) {
      Name(config.name)(obj, property);
    }

    if (!!config.serializer) {
      metadata.serializer = config.serializer;
      Type(config.serializer)(obj, property);
    } else {
      const type = Reflect.getMetadata('design:type', obj, property);
      if (type === Boolean || type === Number || type === String || type === Date) {
        // nothing...
      } else if (type === Array) {
        const persistence = config.type.prototype instanceof Persistence;
        metadata.persistence = persistence;
        metadata.serializer = new ArraySerializer(new ModelSerializer(config.type));
        metadata.reference = new ArraySerializer(new ModelSerializer(persistence ? Reference : config.type));
        Type(metadata.serializer)(obj, property);
      } else {
        const persistence = type.prototype instanceof Persistence;
        metadata.persistence = persistence;
        metadata.serializer = new ModelSerializer(type);
        metadata.reference = new ModelSerializer(persistence ? Reference : type);
        Type(metadata.serializer)(obj, property);
      }
    }

    Field()(obj, property);

    const fields = Reflect.getOwnMetadata(PERSIST_METADATA_KEY, obj) || [];
    fields.push(metadata);
    Reflect.defineMetadata(PERSIST_METADATA_KEY, fields, obj);
  };
}

@persistence()
export class Persistence {

  changes: Subject<Persistence> = new Subject<Persistence>();
  loaded = false;
  imported = false;
  snapshot: Object;

  @persist({name: '_id'})
  id: string;

  @persist({name: '_rev'})
  rev: string;

  merge(db: Database, progress: Subject<Object>, src: Persistence): Observable<Persistence> {
    return new Observable<Persistence>(merged => {
      const loaders = [of(null)];

      this.rev = src.rev;

      const fields = Reflect.getMetadata(PERSIST_METADATA_KEY, this) || [];
      for (const metadata of fields) {
        const property = metadata.property;
        if (metadata.persistence) {
          const type = this.getPropertyType(property);
          if (type === Array) {
            const list: Persistence[] = [];
            for (const element of src[property]) {
              const obj = this[property].find(e => e.id === element.id) || element;
              list.push(obj);
              if (!obj.loaded) {
                loaders.push(element.load(db, progress));
              }
            }

            this[property] = list;
          } else {
            const obj = src[property];
            if (!obj.loaded) {
              loaders.push(obj.load(db, progress));
            }
            this[property] = obj;
          }
        } else {
          this[property] = src[property];
        }
      }

      combineLatest(loaders).pipe(finalize(() => merged.complete()))
        .subscribe(() => {
          this.flush();
          merged.next(this);
          this.changes.next(this);
        }, err => merged.error(err));
    });
  }

  load(db: Database, progress: Subject<Object>): Observable<Persistence> {
    return new Observable(loaded => {
      db.get(this.id).then(doc => {
        const src = this.deserialize(doc);
        this.merge(db, progress, src)
          .pipe(finalize(() => loaded.complete()))
          .subscribe(() => {
            this.loaded = true;
            loaded.next(this);
            progress.next(this);
          });
      }).catch(err => loaded.error(err));
    });
  }

  update(db: Database, progress: Subject<Object>, doc: Document<Object>): Observable<Persistence> {
    return new Observable(updated => {
      if (doc._id === this.id) {
        const src = this.deserialize(doc);
        this.merge(db, progress, src)
          .pipe(finalize(() => updated.complete()))
          .subscribe(() => updated.next(this));
      } else {
        const queue = [of(null)];
        const fields = Reflect.getMetadata(PERSIST_METADATA_KEY, this) || [];
        for (const metadata of fields) {
          const property = metadata.property;
          if (!!metadata && metadata.persistence) {
            const type = this.getPropertyType(property);
            if (type === Array) {
              const list: Persistence[] = this[property];
              for (const element of list) {
                queue.push(element.update(db, progress, doc));
              }
            } else {
              const obj: Persistence = this[property];
              queue.push(obj.update(db, progress, doc));
            }
          }
        }

        combineLatest(queue)
          .pipe(finalize(() => updated.complete()))
          .subscribe(() => updated.next(this), err => updated.error(err));
      }
    });
  }

  import(db: Database, progress: Subject<Object>, id: string = null): Observable<Persistence> {
    if (this.imported) {
      return of(this);
    }

    this.imported = true;

    return new Observable(imported => {
      this.id = id || generate();
      const queue = [of(null)];
      const fields = Reflect.getMetadata(PERSIST_METADATA_KEY, this) || [];
      for (const metadata of fields) {
        const property = metadata.property;
        if (!!metadata && metadata.persistence) {
          const type = this.getPropertyType(property);
          if (type === Array) {
            const list = this[property];
            for (const element of list) {
              try {
                queue.push(element.import(db, progress));
              } catch (e) {

              }
            }
          } else {
            const obj = this[property];
            queue.push(obj.import(db, progress));
          }
        }
      }

      combineLatest(queue).subscribe(() => {
        const reference = this.serialize(SerializeType.reference);
        db.put(reference)
          .then(doc => {
            this.rev = doc.rev;
            imported.next(this);
            progress.next(this);
          })
          .catch(err => imported.error(err))
          .finally(() => imported.complete());
      }, err => imported.error(err));
    });
  }

  serialize(type: SerializeType = SerializeType.default): Object {
    const prototype = Object.getPrototypeOf(this);
    const fields = Reflect.getMetadata(PERSIST_METADATA_KEY, this) || [];
    for (const metadata of fields) {
      const property = metadata.property;
      if (!!metadata && !!metadata.serializer) {
        Type(type === SerializeType.reference
          ? (metadata.reference || metadata.serializer) : metadata.serializer)(prototype, property);
      }
    }

    return serialize(this);
  }

  deserialize(obj: Object): Persistence {
    const prototype = Object.getPrototypeOf(this);
    const fields = Reflect.getMetadata(PERSIST_METADATA_KEY, this) || [];
    for (const metadata of fields) {
      const property = metadata.property;
      if (!!metadata && !!metadata.serializer) {
        Type(metadata.serializer)(prototype, property);
      }
    }

    return deserialize(obj, prototype.constructor);
  }

  dirty(): boolean {
    return !deepEqual(this.snapshot, this.serialize(SerializeType.reference));
  }

  flush(): void {
    this.snapshot = this.serialize(SerializeType.reference);
  }

  private getPropertyType(property: string) {
    return Reflect.getMetadata('design:type', this, property);
  }

}
