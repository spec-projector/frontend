import {Feature} from './feature';
import {Space} from '../space';
import {ValidationError} from '../../validation/error';
import {persist, persistence, Persistence} from '../../decorators/persistence';

@persistence()
export class Actor extends Persistence {

    @persist()
    name: string;

    @persist({type: Feature})
    features: Feature[] = [];

    constructor(defs: any = {}) {
        super();
        Object.assign(this, defs);
    }

    linking(space: Space) {
        for (const feature of this.features) {
            feature.linking(space, this);
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
