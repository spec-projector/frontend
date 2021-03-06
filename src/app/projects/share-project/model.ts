import { ArraySerializer, Field, Model, model, PrimitiveSerializer } from 'serialize-ts';
import { ProjectMemberRole, ProjectPermission } from '../../../enums/project';

@Model()
export class ProjectMemberUpdate {

  @Field()
  id: string;

  @Field()
  role: ProjectMemberRole;

  @Field({serializer: new ArraySerializer(new PrimitiveSerializer())})
  permissions: ProjectPermission[];
}
