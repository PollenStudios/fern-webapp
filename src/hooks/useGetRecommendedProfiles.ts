import React, { useEffect, useReducer, useState } from 'react';
import { ApolloError, useLazyQuery } from '@apollo/client';
import { RecommendedProfilesDocument, RecommendedProfilesQuery } from 'graphql/generated/types';

// custom hook for getting recommended profiles

const useGetRecommendedProfiles = () => {
  const [getRecommendedProfiles] = useLazyQuery(RecommendedProfilesDocument);
  const [recommendedProfilesState, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: 'loading', payload: true });
    (async () => {
      const {
        data,
        loading: loadingGetRecommendedProfiles,
        error: errorRecommendedProfiles,
      } = await getRecommendedProfiles();
      if (data && data.recommendedProfiles !== undefined) {
        dispatch({
          type: 'recommendedProfiles',
          payload: data.recommendedProfiles,
        });
        dispatch({ type: 'loading', payload: loadingGetRecommendedProfiles });
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.log('err', errorRecommendedProfiles);
        }
        dispatch({ type: 'loading', payload: loadingGetRecommendedProfiles });
        dispatch({ type: 'error', payload: errorRecommendedProfiles });
      }
    })();
  }, []);
  return recommendedProfilesState;
};

export default useGetRecommendedProfiles;

const initialState = {
  recommendedProfiles: <RecommendedProfilesQuery['recommendedProfiles']>[],
  loading: <boolean>false,
  error: <ApolloError | null>null,
};

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'recommendedProfiles':
      return {
        recommendedProfiles: action.payload,
        loading: false,
        error: null,
      };
    case 'loading':
      return { ...state, loading: action.payload, error: null };
    case 'error':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
