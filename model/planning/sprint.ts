import {ArraySerializer, ModelSerializer} from 'serialize-ts';
import {Feature} from './feature';
import {Improvement} from './improvement';
import {Space} from '../space';
import {ValidationError} from '../../validation/error';
import {persist, persistence} from '../../decorators/persistence';

@persistence()
export class Sprint {

    @persist()
    id: string;

    @persist()
    title: string;

    @persist({serializer: new ArraySerializer(new ModelSerializer(Feature))})
    features: Feature[] = [];

    @persist({serializer: new ArraySerializer(new ModelSerializer(Improvement))})
    improvements: Improvement[] = [];

    constructor(defs: any = {}) {
        Object.assign(this, defs);
    }

    linking(space: Space) {
        for (const feature of this.features) {
            feature.linking(space);
        }
        for (const improvement of this.improvements) {
            improvement.feature.linking(space);
        }
    }

    validateTerms(space: Space) {
        let errors: ValidationError[] = [];
        for (const feature of this.features) {
            const errs = feature.validate(space);
            if (!!errs) {
                errs.forEach(e => e.sprint = this);

                errors = errors.concat(errs);
            }
        }

        return errors;
    }
}
