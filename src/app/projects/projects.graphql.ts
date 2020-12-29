import { Injectable } from '@angular/core';
import { Mutation, Query } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class AllProjectsGQL extends Query<{ allProjects }> {
  document = gql`
query(
    $offset: Int
    $before: String
    $after: String
    $first: Int
    $last: Int
    $title: String
    $orderBy: String
) {
    allProjects(
        offset: $offset
        before: $before
        after: $after
        first: $first
        last: $last
        title: $title
        orderBy: $orderBy
    ) {
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
mutation($title: String!) {
    response:createProject(title: $title) {
        project {
            id
            title
        }
    }
}`;
}

@Injectable({
  providedIn: 'root'
})
export class UpdateProjectGQL extends Mutation<{ response: { project } }> {
  document = gql`
mutation($id: ID!, $title: String!) {
    response:updateProject(id: $id, title: $title) {
        project {
            id
            title
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
