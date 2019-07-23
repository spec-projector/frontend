import { persist, persistence, Persistence } from 'src/decorators/persistence';
import { ValidationError } from 'src/app/model/validation/error';
import { Spec } from '../spec';
import { Feature } from './feature';

@persistence()
export class Actor extends Persistence {

    @persist()
    name: string;

    @persist({type: Feature})
    features: Feature[] = [];

    space: Spec;

    constructor(defs: any = {}) {
        super();
        Object.assign(this, defs);
    }

    linking(space: Spec) {
        this.space = space;
        for (const feature of this.features) {
            feature.linking({actor: this});
        }
    }

    validate(space: Spec) {
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
