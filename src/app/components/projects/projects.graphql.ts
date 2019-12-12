import { Injectable } from '@angular/core';
import { Mutation, Query } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
    providedIn: 'root'
})
export class AllProjectsGQL extends Query<{ allProjects }> {
    document = gql`
    query AllProjects($offset: Int, $before: String, $after: String, $first: Int, $last: Int, $title: String, $orderBy: String) {
      allProjects(offset: $offset, before: $before, after: $after, first: $first, last: $last, title: $title, orderBy: $orderBy) {
        count
        edges {
          node {
            id
            createdAt
            updatedAt
            title
            description
            owner {
                id
                lastLogin
                isSuperuser
                login
                name
                email
                isStaff
                isActive
              }
          }
        }
      }
    }`;
}

@Injectable({
    providedIn: 'root'
})
export class CreateProjectGQL extends Mutation<{ project }> {
    document = gql`
    mutation CreateProject($title: String!) {
      createProject(title: $title) {
        project {
          id
          createdAt
          updatedAt
          title
          description
          owner {
            id
            lastLogin
            isSuperuser
            login
            name
            email
            isStaff
            isActive
          }
        }
      }
    }`;
}

@Injectable({
    providedIn: 'root'
})
export class UpdateProjectGQL extends Mutation<{ project }> {
    document = gql`
    mutation UpdateProject($description: String, $project: String!, $title: String!) {
      updateProject(description: $description, project: $project, title: $title) {
        project {
          id
          createdAt
          updatedAt
          title
          description
          owner {
            id
            lastLogin
            isSuperuser
            login
            name
            email
            isStaff
            isActive
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
    mutation ($project: String!) {
      deleteProject(project: $project) {
        status
      }
    }`;
}
