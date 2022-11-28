import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useLazyQuery } from '@apollo/client';
import { ProfileDocument, ProfileFeedDocument, PublicationMainFocus, PublicationTypes } from 'graphql/generated/types';
import config from 'utils/config';
import { userProfileLens } from 'utils/generateNonce';
import View from './view';

function UserProfile() {
  const { id } = useParams();
  const [userProfile, setUserProfile] = useState<any>();
  const [userPosts, setUserPosts] = useState<any>();
  const [isArtist, setIsArtist] = useState<boolean>(false);

  // Variables
  const request = {
    publicationTypes: [PublicationTypes.Post],
    profileId: id,
    limit: 10,
    sources: [config.appNameForLensApi],
    metadata: { mainContentFocus: [PublicationMainFocus.Image] },
  };
  const reactionRequest = { profileId: id };
  const profileId = id;

  const [getPosts, { data }] = useLazyQuery(ProfileFeedDocument, {
    onCompleted: async () => {
      // setUserProfile(data?.publications?.items[0]?.profile);
      setUserPosts(data?.publications.items);
    },
  });
  const [getProfile, { data: userProfileResult }] = useLazyQuery(ProfileDocument, {
    onCompleted: async () => {
      setUserProfile(userProfileResult?.profile);
    },
  });

  const userProfileStatus = async (id: string | undefined) => {
    const userStatus = await userProfileLens(id);
    userStatus[0]?.artist_approval_status === 'approved' && setIsArtist(true);
  };

  useEffect(() => {
    getPosts({ variables: { request, reactionRequest, profileId } });
    getProfile({ variables: { request: reactionRequest } });
  }, [data, userProfileResult, id]);

  useEffect(() => {
    userProfileStatus(id);
  }, [id]);

  return <View userProfile={userProfile} isArtist={isArtist} data={data} />;
}

export default UserProfile;
