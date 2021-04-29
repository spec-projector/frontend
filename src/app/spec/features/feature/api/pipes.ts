import { Pipe, PipeTransform } from '@angular/core';
import { Spec } from '../../../../../models/spec/spec';

@Pipe({name: 'graphqlPlayground'})
export class GraphqlPlaygroundPipe implements PipeTransform {

    transform(query: string, spec: Spec): string {
        return spec.tools.graphqlPlaygroundUrl + '#query=' + encodeURI(query);
    }

}
