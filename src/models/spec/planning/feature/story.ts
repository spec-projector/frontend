import { ArraySerializer } from 'serialize-ts';
import { persist, persistence } from '../../../../decorators/persistence';
import { TokenSerializer } from '../../../../serializers/token';
import { Token } from '../token';
import * as assign from 'assign-deep';

export enum StoryEntryType {
  see = 'see',
  can = 'can'
}

@persistence()
export class StoryEntry {

  @persist()
  type: StoryEntryType;

  @persist({serializer: new ArraySerializer(new TokenSerializer())})
  description: Token[];

  constructor(defs: Partial<StoryEntry> = {}) {
    assign(this, defs);
  }

}
