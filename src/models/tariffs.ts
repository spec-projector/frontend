import { ArraySerializer, Field, Model, PrimitiveSerializer } from 'serialize-ts';
import { EdgesToPaging } from '../serializers/graphql';

export enum TariffFeatures {
  projectMembersRoles = 'PROJECT_MEMBERS_ROLES',
  printContract = 'PRINT_CONTRACT',
  exportImport = 'EXPORT_IMPORT',
  communityChat = 'COMMUNITY_CHAT',
  slackSupport = 'SLACK_SUPPORT',
  exclusiveSlackSupport = 'EXCLUSIVE_SLACK_SUPPORT'
}

@Model()
export class Tariff {

  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  teaser: string;

  @Field()
  icon: string;

  @Field()
  price: number;

  @Field({serializer: new ArraySerializer(new PrimitiveSerializer())})
  features: TariffFeatures[];

  @Field()
  maxProjects: number;

  @Field()
  maxProjectMembers: number;

}

@Model()
export class PagingTariffs {

  @Field()
  count: number;

  @Field({
    jsonPropertyName: 'edges',
    serializer: new ArraySerializer(new EdgesToPaging<Tariff>(Tariff))
  })
  results: Tariff[];

}
