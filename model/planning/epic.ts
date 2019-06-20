import {Feature} from './feature';
import {Space} from '../space';
import {ValidationError} from '../../validation/error';
import {persist, persistence} from '../../decorators/persistence';

@persistence()
export class Epic {

    @persist()
    title: string;

    @persist({type: Feature})
    features: Feature[] = [];

    constructor(defs: any = {}) {
        Object.assign(this, defs);
    }

    linking(space: Space) {
        for (const feature of this.features) {
            feature.linking(space, null, this);
        }
    }

    validateTerms(space: Space) {
        let errors: ValidationError[] = [];
        for (const feature of this.features) {
            const errs = feature.validate(space);
            if (!!errs) {
                errs.forEach(e => e.epic = this);

                errors = errors.concat(errs);
            }
        }

        return errors;
    }
}
