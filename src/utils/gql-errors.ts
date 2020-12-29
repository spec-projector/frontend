import { ErrorResponse } from 'apollo-link-error';
import { Observable } from 'rxjs';
import { deserialize } from 'serialize-ts';
import { AuthorisationError, BackendError, NetworkError, NotFoundError } from '../types/gql-errors';

export function convertGQLErrors({graphQLErrors, networkError}: ErrorResponse): BackendError[] {
  if (!!networkError) {
    if ('status' in networkError) {
      const msg = networkError['message'];
      switch (networkError['status']) {
        case 401:
          return [new AuthorisationError(msg)];
        case 404:
          return [new NotFoundError(msg)];
        default:
          return [new NetworkError(msg)];
      }

    }
  }
  if (!!graphQLErrors) {
    return graphQLErrors.map(err => deserialize(err, BackendError));
  }
  return [];
}

export function catchGQLErrors() {
  return function (source: Observable<any>) {
    return new Observable(observer => {
      return source.subscribe({
        next(x) {
          if (x.errors?.length > 0) {
            observer.error(x.errors.map(err => deserialize(err, BackendError)));
          } else {
            observer.next(x);
          }
        },
        error(err: ErrorResponse) {
          observer.error(convertGQLErrors(err));
        },
        complete() {
          observer.complete();
        }
      });
    });
  };
}
