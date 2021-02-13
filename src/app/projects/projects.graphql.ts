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
        title
        description
        isPublic
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
mutation ($input: CreateProjectInput!) {
  response: createProject(input: $input) {
    project {
      id
      title
      description
      isPublic
      figmaIntegration {
        token
      }
      gitlabIntegration {
        token
      }
      githubIntegration {
        token
      }
    }
  }
}`;
}

@Injectable({
  providedIn: 'root'
})
export class UpdateProjectGQL extends Mutation<{ response: { project } }> {
  document = gql`
mutation ($id: ID!, $input: UpdateProjectInput!) {
  response: updateProject(id: $id, input: $input) {
    project {
      id
      title
      description
      isPublic
      figmaIntegration {
        token
      }
      gitlabIntegration {
        token
      }
      githubIntegration {
        token
      }
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
