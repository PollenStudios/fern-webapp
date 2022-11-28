import { useLazyQuery } from '@apollo/client';
import ArtPreviewCard from 'app/components/ArtPreviewCard';
import { Button } from 'app/components/atoms/Buttons';
import { ProfileFeedDocument, PublicationMainFocus, PublicationTypes } from 'graphql/generated/types';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import config, { PageRoutes } from 'utils/config';
import noArtBoards from 'Assets/Images/noArtBoards.png';

function Publications({ currentProfile }: any) {
  const { id } = useParams();
  const [userPosts, setUserPosts] = useState<any>();

  //variables
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
      setUserPosts(data?.publications.items);
    },
  });

  useEffect(() => {
    getPosts({ variables: { request, reactionRequest, profileId } });
  }, [data, id]);

  return (
    <>
      {userPosts && userPosts.length > 0 ? (
        <div className="grid sm:grid-cols-8 lg:grid-cols-12 gap-6 my-2">
          {userPosts.map((post: any, i: number) => (
            <div className="col-span-5 sm:col-span-4 md:col-span-6" key={i}>
              <ArtPreviewCard art={post} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center mt-10">
          <img src={noArtBoards} alt={'noArtBoard'} className="object-cover h-44 w-44 rounded-full mb-4" />
          <h2 className="heading-4">
            {id === currentProfile?.id ? 'You don’t have any post yet' : 'This user doesn’t have any post yet'}
          </h2>

          <Link to={PageRoutes.DISCOVERY} className="mt-5">
            <Button type="button" variant="primary" name="Discover Art" />
          </Link>
        </div>
      )}
    </>
  );
}

export default Publications;
