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
        emblem {
          url
        }
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
          avatar {
            url
          }
          firstName
          lastName
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
      emblem {
        url
      }
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
      emblem {
        url
      }
      figmaIntegration {
        token
      }
      gitlabIntegration {
        token
      }
      githubIntegration {
        token
      }
      isPublic
      publicRole
      publicPermissions
      members {
        user {
          id
          firstName
          lastName
          avatar {
            url
          }
        }
        role
        permissions
      }
      owner {
        id
        firstName
        lastName
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

@Injectable({
  providedIn: 'root'
})
export class FindUserGQL extends Query<{ user }> {
  document = gql`
query ($email: String!) {
  user: findUser(email: $email) {
    id
    firstName
    lastName
    avatar {
      url
    }
  }
}
`;
}
