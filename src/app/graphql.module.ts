import { HttpErrorResponse } from '@angular/common/http';
import { Inject, LOCALE_ID, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo, ApolloModule } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { ErrorResponse, onError } from 'apollo-link-error';
import { Language } from '../enums/language';
import { AppConfig } from './app-config';

function getBackendLanguage(locale): string {
  switch (locale) {
    case Language.ru:
      return 'ru-RU';
    case Language.en:
    default:
      return 'en-US';

  }
}

@NgModule({
  exports: [
    ApolloModule,
    HttpLinkModule
  ],
  providers: [
    AppConfig
  ]
})
export class GraphQLModule {
  constructor(@Inject(LOCALE_ID) locale: string,
              config: AppConfig,
              apollo: Apollo,
              httpLink: HttpLink,
              router: Router) {
    const http = httpLink.create({uri: config.graphqlUrl});
    const authLink = new ApolloLink((operation, forward) => {
      const headers = {
        'Accept-Language': getBackendLanguage(locale)
      };
      if (!!config.token) {
        Object.assign(headers, {
          headers: {
            'Authorization': `Bearer ${config.token.key}`
          }
        });
      }

      operation.setContext({headers});

      return forward(operation);
    });

    const errorLink = onError(({graphQLErrors, networkError}: ErrorResponse) => {
      if (!!networkError) {
        console.log(networkError);
        const {status} = (networkError as HttpErrorResponse);
        if (status === 401) {
          config.token = null;
          router.navigate(['/login']);
        }
      }
      if (!!graphQLErrors) {
        graphQLErrors.map(({message, locations, path}) => {
          console.error(`[GraphQL error]: Message: ${message}, Path: ${path}`);
          console.log('Locations: ', locations);
        });
      }
    });

    const link = ApolloLink.from([
      errorLink,
      authLink,
      http
    ]);

    apollo.create({
      link: link,
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'ignore'
        },
        query: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'all'
        }
      }
    });
  }
}
