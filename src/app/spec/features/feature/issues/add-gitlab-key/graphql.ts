import { Injectable } from '@angular/core';
import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class SetGitLabTokenGQL extends Mutation<{ response: { project } }> {
  document = gql`
mutation ($id: ID!, $input: UpdateProjectInput!) {
  response: updateProject(id: $id, input: $input) {
    project {
      id
      gitlabIntegration {
        token
      }
    }
  }
}`;
}
