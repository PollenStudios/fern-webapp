import React, { useContext, useEffect, useReducer, useState } from 'react';
import { ApolloError, useLazyQuery } from '@apollo/client';
import { RefreshDocument } from 'graphql/generated/types';
import { WalletContext } from 'store/WalletContextProvider';

// custom hook for getting recommended profiles

const useGetRecommendedProfiles = () => {
  const [refreshToken] = useLazyQuery(RefreshDocument);
  const { dispatchIsLoggedIn }: any = useContext(WalletContext);

  useEffect(() => {
    dispatchIsLoggedIn({ type: 'loading', payload: true });
    (async () => {
      try {
        const data = await refreshToken({
          variables: {
            request: {
              refreshToken: localStorage.getItem('refreshToken'),
            },
          },
        });

        localStorage.setItem('accessToken', data.data?.refresh.accessToken);
        localStorage.setItem('refreshToken', data.data?.refresh.refreshToken);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.log('err', error);
        }
        dispatchIsLoggedIn({ type: 'error', payload: error });
      }
    })();
  }, []);
};
export default useGetRecommendedProfiles;
