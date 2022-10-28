import {
    ApolloClient,
    ApolloLink,
    from,
    fromPromise,
    HttpLink,
    InMemoryCache,
    toPromise
  } from '@apollo/client';
  import { RetryLink } from '@apollo/client/link/retry';

  import parseJwt from './Lib/ParseJwt';
  import axios from 'axios';
  
  
  const REFRESH_AUTHENTICATION_MUTATION = `
    mutation Refresh($request: RefreshRequest!) {
      refresh(request: $request) {
        accessToken
        refreshToken
      }
    }
  `;
  
  const httpLink = new HttpLink({
    uri: "https://api-mumbai.lens.dev",
    fetchOptions: 'no-cors',
    fetch
  });
  
  // RetryLink is a link that retries requests based on the status code returned.
  const retryLink = new RetryLink({
    delay: {
      initial: 100
    },
    attempts: {
      max: 2,
      retryIf: (error) => !!error
    }
  });
  
  const clearStorage = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('lenster.store');
    localStorage.removeItem('transaction.store');
  };
  
  const authLink = new ApolloLink((operation, forward) => {
    const accessToken = localStorage.getItem('accessToken');
  
    if (!accessToken || accessToken === 'undefined') {
      clearStorage();
      return forward(operation);
    }
  
    const expiringSoon = Date.now() >= parseJwt(accessToken)?.exp * 1000;
  
    if (!expiringSoon) {
      operation.setContext({
        headers: {
          'x-access-token': accessToken ? `Bearer ${accessToken}` : ''
        }
      });
  
      return forward(operation);
    }
  
    return fromPromise(
      axios("https://api-mumbai.lens.dev", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({
          operationName: 'Refresh',
          query: REFRESH_AUTHENTICATION_MUTATION,
          variables: {
            request: { refreshToken: localStorage.getItem('refreshToken') }
          }
        })
      })
        .then(({ data }) => {
          const accessToken = data?.data?.refresh?.accessToken;
          const refreshToken = data?.data?.refresh?.refreshToken;
          operation.setContext({
            headers: {
              'x-access-token': `Bearer ${accessToken}`
            }
          });
  
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
  
          return toPromise(forward(operation));
        })
        .catch(() => {
          return toPromise(forward(operation));
        })
    );
  });
  
  const cache = new InMemoryCache();
  
  const Client = new ApolloClient({
    link: from([retryLink, authLink, httpLink]),
    cache
  });
  
  export default Client;
  