import { field, model } from '@junte/mocker-library';
import { SearchFilter } from 'junte-ui';
import { ArraySerializer } from 'serialize-ts';
import { Paging } from 'src/app/model/paging';
import { EdgesToPaging } from 'src/app/serializers/graphql';

@model()
export class Project {

    @field({mock: '{{id}}'})
    id: string;

    @field({mock: '{{issue}}'})
    title: string;

    @field({mock: '{{issue}}'})
    dbName: string;
}

@model()
export class PagingProjects implements Paging<Project> {

    @field({mock: '{{int 50 1000}}'})
    count: number;

    @field({
        name: 'edges',
        serializer: new ArraySerializer(new EdgesToPaging<Project>(Project)),
        mock: '[{{#repeat 3 10}} {{> project}} {{/repeat}}]'
    })
    results: Project[];
}

@model()
export class ProjectUpdate {

    @field()
    project: string;

    @field()
    title: string;

    @field()
    description?: string;

    constructor(update: ProjectUpdate) {
        Object.assign(this, update);
    }
}

@model()
export class ProjectsFilter implements SearchFilter {

    @field()
    first?: number;

    @field()
    offset?: number;

    @field()
    q?: string;

    constructor(defs: ProjectsFilter = null) {
        if (!!defs) {
            Object.assign(this, defs);
        }
    }
}
