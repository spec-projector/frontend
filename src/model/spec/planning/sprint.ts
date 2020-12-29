import { ArraySerializer, ModelSerializer } from 'serialize-ts';
import { ValidationError } from 'src/model/validation/error';
import { persist, Persistence, persistence } from 'src/decorators/persistence';
import { Spec } from '../spec';
import { Feature } from './feature';
import { Improvement } from './improvement';

@persistence()
export class Sprint extends Persistence {

    @persist()
    id: string;

    @persist()
    title: string;

    @persist({serializer: new ArraySerializer(new ModelSerializer(Feature))})
    features: Feature[] = [];

    @persist({serializer: new ArraySerializer(new ModelSerializer(Improvement))})
    improvements: Improvement[] = [];

    spec: Spec;

    constructor(defs: any = {}) {
        super();
        Object.assign(this, defs);
    }

    linking(spec: Spec) {
        console.log('sprint linking', this.title);
        this.spec = spec;
        for (const feature of this.features) {
            feature.linking({spec: spec, sprint: this});
        }
        for (const improvement of this.improvements) {
            improvement.feature.linking({spec: spec, sprint: this});
        }
    }

    validateTerms(spec: Spec) {
        let errors: ValidationError[] = [];
        for (const feature of this.features) {
            const errs = feature.validate(spec);
            if (!!errs) {
                errs.forEach(e => e.sprint = this);

                errors = errors.concat(errs);
            }
        }

        return errors;
    }
}
