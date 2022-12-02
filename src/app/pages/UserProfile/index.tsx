import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useLazyQuery } from '@apollo/client';
import { ProfileDocument } from 'graphql/generated/types';
import { userProfileLens } from 'utils/generateNonce';
import View from './view';
import UserProfileSidebar from './userProfileSidebar';
import OverlayLoader from 'app/components/OverlayLoader';

function UserProfile() {
  const { id: profileId } = useParams();
  const [userProfile, setUserProfile] = useState<any>();
  const [isArtist, setIsArtist] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Variables
  const reactionRequest = { profileId };

  const [getProfile, { data: userProfileResult }] = useLazyQuery(ProfileDocument, {
    onCompleted: async () => {
      setUserProfile(userProfileResult?.profile);
    },
  });

  const userProfileStatus = async (profileId: string | undefined) => {
    const userStatus = await userProfileLens(profileId);
    userStatus[0]?.artist_approval_status === 'approved' && setIsArtist(true);
    setIsLoading(false);
  };

  useEffect(() => {
    userProfileStatus(profileId);
    getProfile({ variables: { request: reactionRequest } });
  }, [userProfileResult, profileId]);

  if (isLoading) return <OverlayLoader />;

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{`${
            userProfile ? userProfile?.name || userProfile?.id : 'Profile'
          } - F3rn | Fine Art Discovery and Curation`}</title>
        </Helmet>
      </HelmetProvider>

      <div className="mb-10 mt-16">
        <div>
          <img
            className="w-full h-72 sm:h-96 bg-gray-300"
            src="https://images.unsplash.com/photo-1667679831953-b8fa28deb04e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxNTN8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
            alt="cover"
          />
        </div>
        <div className="main-container flex flex-col md:grid grid-cols-5">
          <UserProfileSidebar userProfile={userProfile} isArtist={isArtist} />
          <View isArtist={isArtist} />
        </div>
      </div>
    </>
  );
}

export default UserProfile;
