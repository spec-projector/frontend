import { persist, persistence } from 'src/decorators/persistence';
import { ArraySerializer, ModelSerializer } from 'serialize-ts';
import { ValidationError } from 'src/app/model/validation/error';
import { Spec } from '../spec';
import { Feature } from './feature';
import { Improvement } from './improvement';

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

    linking(space: Spec) {
        for (const feature of this.features) {
            // feature.linking({space: space});
        }
        for (const improvement of this.improvements) {
            // improvement.feature.linking({space: space});
        }
    }

    validateTerms(space: Spec) {
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
