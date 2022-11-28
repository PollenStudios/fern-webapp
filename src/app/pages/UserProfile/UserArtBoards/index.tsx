import { useLazyQuery } from '@apollo/client';
import ArtPreviewCard from 'app/components/ArtPreviewCard';
import { Button } from 'app/components/atoms/Buttons';
import { ProfileFeedDocument, PublicationMainFocus, PublicationTypes } from 'graphql/generated/types';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import config, { PageRoutes } from 'utils/config';
import noArtBoards from 'Assets/Images/noArtBoards.png';

function ArtBoardPosts({ currentProfile }: any) {
  const { id: profileId } = useParams();
  const [ArtBoards, setArtBoards] = useState<any>();

  //variables
  const request = {
    publicationTypes: [PublicationTypes.Mirror],
    profileId,
    limit: 10,
    sources: [config.appNameForLensApi],
    metadata: { mainContentFocus: [PublicationMainFocus.Image] },
  };
  const reactionRequest = { profileId };

  const [getArtBoards, { data }] = useLazyQuery(ProfileFeedDocument, {
    onCompleted: async () => {
      setArtBoards(data?.publications.items);
    },
  });

  useEffect(() => {
    getArtBoards({ variables: { request, reactionRequest, profileId } });
  }, [data, profileId]);

  return (
    <>
      {ArtBoards && ArtBoards.length > 0 ? (
        <div className="grid sm:grid-cols-8 lg:grid-cols-12 gap-6 my-2">
          {ArtBoards.map((artBoard: any, i: number) => (
            <div className="col-span-5 sm:col-span-4 md:col-span-6" key={i}>
              <ArtPreviewCard art={artBoard} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyArtBoard profileId={profileId} currentProfile={currentProfile} />
      )}
    </>
  );
}

export default ArtBoardPosts;

export const EmptyArtBoard = ({ profileId, currentProfile }: any) => {
  return (
    <div className="flex flex-col items-center mt-10">
      <img src={noArtBoards} alt={'noArtBoard'} className="object-cover h-44 w-44 rounded-full mb-4" />
      <h2 className="heading-4">
        {profileId === currentProfile?.id
          ? 'You don’t have any Art Boards yet'
          : 'This user doesn’t have any Art Boards yet'}
      </h2>
      <h6 className="paragraph-3">
        {profileId === currentProfile?.id && 'Get started by browsing art to curate your board.'}
      </h6>
      <Link to={PageRoutes.DISCOVERY} className="mt-5">
        <Button type="button" variant="primary" name="Discover Art" />
      </Link>
    </div>
  );
};
