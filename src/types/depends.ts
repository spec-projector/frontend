import { Persistence } from '../decorators/persistence';

export interface Depends {
  changed: Persistence[];
  deleted: Persistence[];
}
