import { persist, persistence, Persistence } from 'src/decorators/persistence';
import { Package } from './package';

@persistence()
export class EnumOption {

  @persist()
  title: string;

  @persist()
  name: string;

  @persist()
  autoName: boolean = true;

  constructor(defs: Partial<EnumOption> = {}) {
    Object.assign(this, defs);
  }
}

@persistence()
export class Enum extends Persistence {

  @persist()
  id: string;

  @persist()
  title: string;

  @persist()
  autoName: boolean = true;

  @persist()
  name: string;

  @persist({type: EnumOption})
  options: EnumOption[] = [];

  package: Package;

  constructor(defs: Partial<Enum> = {}) {
    super();
    Object.assign(this, defs);
  }

  linking(pack: Package) {
    this.package = pack;
  }

}
