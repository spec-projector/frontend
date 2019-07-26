import { persist, Persistence, persistence } from 'src/decorators/persistence';
import { Spec } from 'src/app/model/spec/spec';
import { ValidationError } from 'src/app/model/validation/error';
import { Feature } from './feature';

@persistence()
export class Epic extends Persistence {

    @persist()
    title: string;

    @persist({type: Feature})
    features: Feature[] = [];

    spec: Spec;

    constructor(defs: any = {}) {
        super();
        Object.assign(this, defs);
    }

    linking(spec: Spec) {
        this.spec = spec;
        const features = spec.actors.reduce((res, actor) => res.concat(actor.features), []);
        for (let i = 0; i < this.features.length; i++) {
            const feature = this.features[i];
            const found = features.find(e => e.id === feature.id);
            if (!!found) {
                found.linking({epic: this});
                this.features[i] = found;
            }
        }
    }

    validateTerms(spec: Spec) {
        let errors: ValidationError[] = [];
        for (const feature of this.features) {
            const errs = feature.validate(spec);
            if (!!errs) {
                errs.forEach(e => e.epic = this);

                errors = errors.concat(errs);
            }
        }

        return errors;
    }
}
