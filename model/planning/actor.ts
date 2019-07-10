import { persist, persistence, Persistence } from 'decorators/persistence';
import { ValidationError } from 'validation/error';
import { Space } from '../space';
import { Feature } from './feature';

@persistence()
export class Actor extends Persistence {

    @persist()
    name: string;

    @persist({type: Feature})
    features: Feature[] = [];

    space: Space;

    constructor(defs: any = {}) {
        super();
        Object.assign(this, defs);
    }

    linking(space: Space) {
        this.space = space;
        for (const feature of this.features) {
            feature.linking({space: space, actor: this});
        }
    }

    validate(space: Space) {
        let errors: ValidationError[] = [];
        for (const feature of this.features) {
            const errs = feature.validate(space);
            if (!!errs) {
                errs.forEach(e => e.actor = this);

                errors = errors.concat(errs);
            }
        }

        return errors;
    }
}
