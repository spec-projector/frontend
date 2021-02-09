import { SearchFilter } from '@junte/ui';
import { ArraySerializer, Field, Model } from 'serialize-ts';
import { EdgesToPaging } from 'src/serializers/graphql';

@Model()
export class Project {

  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  isPublic: boolean;

  @Field()
  dbName: string;

}

@Model()
export class PagingProjects {

  @Field()
  count: number;

  @Field({
    jsonPropertyName: 'edges',
    serializer: new ArraySerializer(new EdgesToPaging<Project>(Project))
  })
  results: Project[];

}

@Model()
export class ProjectUpdate {

  @Field()
  title: string;

  @Field()
  isPublic: boolean;

  @Field()
  description?: string;

  constructor(update: Partial<ProjectUpdate> = null) {
    Object.assign(this, update);
  }

}

@Model()
export class ProjectsFilter implements SearchFilter {

  @Field()
  first?: number;

  @Field()
  offset?: number;

  @Field()
  q?: string;

  constructor(defs: Partial<ProjectsFilter> = null) {
    if (!!defs) {
      Object.assign(this, defs);
    }
  }

}
