import { Persistence } from '../decorators/persistence';

export interface Patch {
  changed: Persistence[];
  deleted: Persistence[];
}
