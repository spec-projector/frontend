import { Injectable } from '@angular/core';
import { Mutation, Query } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class AllProjectsGQL extends Query<{ projects }> {
  document = gql`
{
  projects: allProjects {
    count
    edges {
      node {
        id
        createdAt
        updatedAt
        title
        description
        isPublic
        owner {
          id
          lastLogin
          login
          name
          email
        }
      }
    }
  }
}`;
}

@Injectable({
  providedIn: 'root'
})
export class CreateProjectGQL extends Mutation<{ response: { project } }> {
  document = gql`
mutation($title: String!, $isPublic: Boolean) {
    response:createProject(title: $title, isPublic: $isPublic) {
        project {
            id
            title
            isPublic
        }
    }
}`;
}

@Injectable({
  providedIn: 'root'
})
export class UpdateProjectGQL extends Mutation<{ response: { project } }> {
  document = gql`
mutation($id: ID!, $title: String!, $isPublic: Boolean) {
    response:updateProject(id: $id, title: $title, isPublic: $isPublic) {
        project {
            id
            title
            isPublic
        }
    }
}`;
}

@Injectable({
  providedIn: 'root'
})
export class DeleteProjectGQL extends Mutation<{ status }> {
  document = gql`
mutation($id: ID!) {
    deleteProject(project: $id) {
        status
    }
}`;
}
