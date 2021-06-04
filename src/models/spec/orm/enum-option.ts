import { persist, Persistence, persistence } from '../../../decorators/persistence';
import { Depends } from '../../../types/depends';
import { ModelType } from '../../enums';
import { Enum } from './enum';
import * as assign from 'assign-deep';

@persistence()
export class EnumOption extends Persistence {

  @persist({name: 'model_type'})
  modelType: string = ModelType.enumOption;

  @persist()
  title: string;

  @persist()
  name: string;

  @persist()
  autoName: boolean = true;

  enum: Enum;

  linking(enum_: Enum) {
    if (!!enum_) {
      this.enum = enum_;
    }
  }

  delete(): Depends {
    const links = {changed: [], deleted: [this]};

    this.enum.removeOption(this);
    links.changed.push(this.enum);

    return links;
  }

  constructor(defs: Partial<EnumOption> = {}) {
    super();
    assign(this, defs);
  }

}
