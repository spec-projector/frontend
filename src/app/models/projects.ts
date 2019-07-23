import { field, model } from '@junte/mocker-library';
import { ArraySerializer, DateSerializer, ModelSerializer } from 'serialize-ts';
import { Paging } from 'src/app/models/paging';

@model()
export class Project {

    @field({mock: '{{id}}'})
    id: string;

    @field({mock: '{{issue}}'})
    title: string;

    @field({
        name: 'create_date',
        serializer: new DateSerializer(),
        mock: '{{date \'2019\' \'2020\'}}'
    })
    createDate: Date;
}

@model()
export class PagingProjects implements Paging<Project> {

    @field({mock: '{{int 50 1000}}'})
    count: number;

    @field({
        serializer: new ArraySerializer(new ModelSerializer(Project)),
        mock: '[{{#repeat 10 20}} {{> project}} {{/repeat}}]'
    })
    results: Project[];

}
