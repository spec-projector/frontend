import { Injectable } from '@angular/core';
import { Query } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
    providedIn: 'root'
})
export class ProjectGQL extends Query<{ project }> {
    document = gql`
query Project($id: ID!) {
  project(id: $id) {
    id
    createdAt
    updatedAt
    title
    description
    dbName
    figmaIntegration {
      token
    }
    gitlabIntegration {
      token
    }
    githubIntegration {
      token
    }
    owner {
      id
      name
    }
  }
}`;
}
