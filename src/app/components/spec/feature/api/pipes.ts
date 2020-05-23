import { Pipe, PipeTransform } from '@angular/core';
import { Spec } from '../../../../model/spec/spec';

@Pipe({name: 'graphqlPlayground'})
export class GraphqlPlaygroundPipe implements PipeTransform {

    transform(query: string, spec: Spec): string {
        return spec.integration.graphqlPlaygroundUrl + '#query=' + encodeURI(query);
    }

}
