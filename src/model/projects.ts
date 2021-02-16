import { SearchFilter } from '@junte/ui';
import { ArraySerializer, Field, Model } from 'serialize-ts';
import { EdgesToPaging } from 'src/serializers/graphql';
import * as assign from 'assign-deep';
import { SecureString } from '../serializers/string';

@Model()
export class FigmaIntegration {

  @Field({serializer: new SecureString()})
  token: string;

}

@Model()
export class GitlabIntegration {

  @Field({serializer: new SecureString()})
  token: string;

}

@Model()
export class GithubIntegration {

  @Field({serializer: new SecureString()})
  token: string;

}

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

  @Field()
  figmaIntegration: FigmaIntegration;

  @Field()
  gitlabIntegration: GitlabIntegration;

  @Field()
  githubIntegration: GithubIntegration;

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
export class FigmaIntegrationUpdate {

  @Field({serializer: new SecureString()})
  token: string;

}

@Model()
export class GitlabIntegrationUpdate {

  @Field({serializer: new SecureString()})
  token: string;

}

@Model()
export class GithubIntegrationUpdate {

  @Field({serializer: new SecureString()})
  token: string;

}

@Model()
export class ProjectUpdate {

  @Field()
  title: string;

  @Field()
  isPublic: boolean;

  @Field()
  description?: string;

  @Field()
  figmaIntegration: FigmaIntegrationUpdate = new FigmaIntegrationUpdate();

  @Field()
  gitlabIntegration: GitlabIntegration = new GitlabIntegration();

  @Field()
  githubIntegration: GithubIntegration = new GithubIntegration();

  constructor(update: Partial<ProjectUpdate> = null) {
    assign(this, update);
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
      assign(this, defs);
    }
  }

}
