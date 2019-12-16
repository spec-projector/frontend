import { Injectable } from '@angular/core';
import { Query } from 'apollo-angular';
import gql from 'graphql-tag';
import { IssueState } from '../../../../model/enums/issue';

@Injectable({
    providedIn: 'root'
})
export class IssueGQL extends Query<{ issue: { title: string, state: IssueState } }> {
    document = gql`
    query ($url: String!, $token: String!, $system: System!) {
      issue(url: $url, token: $token, system: $system) {
        state:status
        title
      }
    }`;
}
