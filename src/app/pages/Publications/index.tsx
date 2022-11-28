import ArtPreviewCard from 'app/components/ArtPreviewCard';
import { Loader } from 'app/components/atoms/Loader';
import { CustomFiltersTypes, SearchRequestTypes, useSearchPublicationsQuery } from 'graphql/generated/types';
import { useContext } from 'react';
import { WalletContext } from 'store/WalletContextProvider';
import config from 'utils/config';

function Publication({ query }: any) {
  const {
    currentProfileState: { currentProfile },
  }: any = useContext(WalletContext);

  // Variables
  const request = {
    query,
    type: SearchRequestTypes.Publication,
    customFilters: [CustomFiltersTypes.Gardeners],
    limit: 10,
    sources: [config.appNameForLensApi],
  };
  const reactionRequest = currentProfile ? { profileId: currentProfile?.id } : null;
  const profileId = currentProfile?.id ?? null;

  const { data, loading, error, fetchMore } = useSearchPublicationsQuery({
    variables: { request, reactionRequest, profileId },
  });

  // @ts-ignore
  const publications = data?.search?.items;

  // @ts-ignore
  //   const pageInfo = data?.search?.pageInfo;
  //   const hasMore = pageInfo?.next && publications?.length !== pageInfo.totalCount;

  //   const loadMore = async () => {
  //     await fetchMore({
  //       variables: { request: { ...request, cursor: pageInfo?.next }, reactionRequest, profileId },
  //     });
  //   };

  if (loading) {
    return (
      <div className="w-full h-[63vh] flex justify-center items-center">
        <Loader />
      </div>
    );
  }
  return (
    <div>
      {publications?.length > 0 ? (
        <div className="grid sm:grid-cols-8 lg:grid-cols-12 gap-6 mt-10">
          {publications?.map((post: any, index: number) => (
            <div className="col-span-4" key={index}>
              <ArtPreviewCard art={post} />
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full h-[60vh] flex justify-center items-center heading-4">No Art found</div>
      )}
    </div>
  );
}

export default Publication;
