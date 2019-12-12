import { Injectable } from '@angular/core';
import { Query } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
    providedIn: 'root'
})
export class MeGQL extends Query<{ me }> {
    document = gql`
    query Me {
      me {
        id
        lastLogin
        idSuperuser
        login
        name
        email
        isStaff
        isActive
      }
    }`;
}
