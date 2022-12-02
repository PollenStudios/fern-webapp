import ArtPreviewCard from 'app/components/ArtPreviewCard';
import { Button } from 'app/components/atoms/Buttons';
import { PublicationMainFocus, PublicationTypes, useProfileFeedQuery } from 'graphql/generated/types';
import { Link, useParams } from 'react-router-dom';
import config, { PageRoutes } from 'utils/config';
import noArtBoards from 'Assets/Images/noArtBoards.png';
import { Loader } from 'app/components/atoms/Loader';
import InfiniteScroll from 'react-infinite-scroll-component';
import { hasMoreMessage } from 'utils/constant';

//don't remove anything in this code, we need it in future

function ArtBoardPosts({ currentProfile }: any) {
  const { id: profileId } = useParams();

  //variables
  const request = {
    publicationTypes: [PublicationTypes.Mirror],
    profileId,
    limit: 10,
    sources: [config.appNameForLensApi],
    metadata: { mainContentFocus: [PublicationMainFocus.Image] },
  };

  // API Call Sort By
  const { data, loading, error, fetchMore } = useProfileFeedQuery({
    variables: { request },
  });

  // @ts-ignore
  const publications = data?.publications?.items;

  // @ts-ignore
  const pageInfo = data?.publications?.pageInfo;
  const hasMore = pageInfo?.next && publications?.length !== pageInfo?.totalCount;

  const loadMore = async () => {
    await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next } },
    });
  };

  if (loading)
    return (
      <div className="flex h-full justify-center items-center">
        <Loader />
      </div>
    );

  // in Futute uncomment this code and remove div with coming soon

  // if (publications?.length === 0) {
  //   return <EmptyArtBoard profileId={profileId} currentProfile={currentProfile} />;
  // }

  return (
    <div className="w-full h-[40vh] flex justify-center items-center heading-5">Coming Soon</div>
    // <InfiniteScroll
    //   style={{ overflow: 'hidden' }}
    //   next={loadMore}
    //   hasMore={hasMore}
    //   loader={<Loader />}
    //   scrollThreshold={0.9}
    //   dataLength={publications?.length ?? 0}
    // >
    //   <div className="grid sm:grid-cols-8 lg:grid-cols-12 gap-6 my-2">
    //     {publications?.map((artBoard: any, i: number) => (
    //       <div className="col-span-5 sm:col-span-4 md:col-span-6" key={i}>
    //         <ArtPreviewCard art={artBoard} />
    //       </div>
    //     ))}
    //   </div>
    //   {!hasMore && <div className="flex justify-center mt-10">{hasMoreMessage}</div>}
    // </InfiniteScroll>
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
