import { ApolloClient, ApolloLink, from, fromPromise, HttpLink, InMemoryCache, toPromise } from '@apollo/client';
import { RetryLink } from '@apollo/client/link/retry';
import config from 'utils/config';

import parseJwt from 'utils/parseJwt';
import axios from 'axios';
import clearStorage from './clearStorage';
import { REFRESH_AUTHENTICATION_MUTATION } from 'graphql/queries';
import cursorBasedPagination from './cursorBasedPagination';
import { publicationKeyFields } from './keyFields';

const httpLink = new HttpLink({
  uri: config.isMainNet ? config.lensUri : config.lensMumbaiUri,
  fetchOptions: 'no-cors',
  fetch,
});

// RetryLink is a link that retries requests based on the status code returned.
const retryLink = new RetryLink({
  delay: {
    initial: 100,
  },
  attempts: {
    max: 2,
    retryIf: error => !!error,
  },
});

export const authLink = new ApolloLink((operation, forward) => {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken || accessToken === 'undefined') {
    clearStorage();
    return forward(operation);
  }

  const isExpired = Date.now() >= parseJwt(accessToken)?.exp * 1000;

  if (!isExpired) {
    operation.setContext({
      headers: {
        'x-access-token': accessToken ? `Bearer ${accessToken}` : '',
      },
    });

    return forward(operation);
  }
  const axiosOptions = {
    method: 'POST',
    url: config.isMainNet ? config.lensUri : config.lensMumbaiUri,
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({
      operationName: 'Refresh',
      query: REFRESH_AUTHENTICATION_MUTATION,
      variables: {
        request: { refreshToken: localStorage.getItem('refreshToken') },
      },
      fetchPolicy: 'network-only',
    }),
  };
  return fromPromise(
    axios(axiosOptions)
      .then(({ data }) => {
        const accessToken = data?.data?.refresh?.accessToken;
        const refreshToken = data?.data?.refresh?.refreshToken;
        operation.setContext({
          headers: {
            'x-access-token': `Bearer ${accessToken}`,
          },
        });

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        return toPromise(forward(operation));
      })
      .catch(() => {
        return toPromise(forward(operation));
      }),
  );
});

const cache = new InMemoryCache({
  // possibleTypes: result.possibleTypes,
  typePolicies: {
    Post: { keyFields: publicationKeyFields },
    Comment: { keyFields: publicationKeyFields },
    Mirror: { keyFields: publicationKeyFields },
    Query: {
      fields: {
        timeline: cursorBasedPagination(['request', ['profileId']]),
        feed: cursorBasedPagination(['request', ['profileId', 'feedEventItemTypes']]),
        feedHighlights: cursorBasedPagination(['request', ['profileId']]),
        explorePublications: cursorBasedPagination(['request', ['sortCriteria', 'metadata']]),
        publications: cursorBasedPagination(['request', ['profileId', 'commentsOf', 'publicationTypes', 'metadata']]),
        nfts: cursorBasedPagination(['request', ['ownerAddress', 'chainIds']]),
        notifications: cursorBasedPagination(['request', ['profileId', 'notificationTypes']]),
        followers: cursorBasedPagination(['request', ['profileId']]),
        following: cursorBasedPagination(['request', ['address']]),
        search: cursorBasedPagination(['request', ['query', 'type']]),
        profiles: cursorBasedPagination(['request', ['profileIds', 'ownedBy', 'handles', 'whoMirroredPublicationId']]),
        whoCollectedPublication: cursorBasedPagination(['request', ['publicationId']]),
        whoReactedPublication: cursorBasedPagination(['request', ['publicationId']]),
        mutualFollowersProfiles: cursorBasedPagination(['request', ['viewingProfileId', 'yourProfileId', 'limit']]),
      },
    },
  },
});

const Client = new ApolloClient({
  link: from([retryLink, authLink, httpLink]),
  cache,
});

export default Client;
