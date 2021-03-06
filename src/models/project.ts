import {SearchFilter} from '@junte/ui';
import * as assign from 'assign-deep';
import {ArraySerializer, Field, Model, PrimitiveSerializer} from 'serialize-ts';
import {ModelMetadataSerializer} from 'serialize-ts/dist/serializers/model-metadata.serializer';
import {EdgesToPaging} from 'src/serializers/graphql';
import {ProjectMemberUpdate} from '../app/projects/share-project/model';
import {ProjectMemberRole, ProjectPermission} from '../enums/project';
import {SecureString} from '../serializers/string';
import {Image} from './image';
import {User} from './user';

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
export class ProjectMember {

  @Field()
  user: User;

  @Field()
  role: ProjectMemberRole;

  @Field({serializer: new ArraySerializer(new PrimitiveSerializer())})
  permissions: ProjectPermission[];

  constructor(defs: Partial<ProjectMember> = {}) {
    assign(this, defs);
  }
}

@Model()
export class ForMeInProject {

  @Field()
  role: ProjectMemberRole;

  @Field({serializer: new ArraySerializer(new PrimitiveSerializer())})
  permissions: ProjectPermission[];

}

@Model()
export class Project {

  @Field()
  id: string;

  @Field()
  emblem: Image;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  dbName: string;

  @Field()
  figmaIntegration: FigmaIntegration;

  @Field()
  gitlabIntegration: GitlabIntegration;

  @Field()
  githubIntegration: GithubIntegration;

  @Field()
  isPublic: boolean;

  @Field()
  publicRole: ProjectMemberRole;

  @Field({serializer: new ArraySerializer(new PrimitiveSerializer())})
  publicPermissions: ProjectPermission[];

  @Field({serializer: new ArraySerializer(new ModelMetadataSerializer(ProjectMember))})
  members: ProjectMember[];

  @Field()
  me: ForMeInProject;

  @Field()
  owner: User;

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
  emblem: string;

  @Field()
  title: string;

  @Field()
  description?: string;

  @Field()
  figmaIntegration: FigmaIntegrationUpdate = new FigmaIntegrationUpdate();

  @Field()
  gitlabIntegration: GitlabIntegration = new GitlabIntegration();

  @Field()
  githubIntegration: GithubIntegration = new GithubIntegration();

  @Field()
  isPublic: boolean;

  @Field()
  publicRole: ProjectMemberRole;

  @Field({serializer: new ArraySerializer(new PrimitiveSerializer())})
  publicPermissions: ProjectPermission[];

  @Field({serializer: new ArraySerializer(new ModelMetadataSerializer(ProjectMemberUpdate))})
  members: ProjectMemberUpdate[];

  constructor(defs: Partial<ProjectUpdate> = {}) {
    assign(this, defs);
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

  constructor(defs: Partial<ProjectsFilter> = {}) {
    assign(this, defs);
  }

}
