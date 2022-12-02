import ArtPreviewCard from 'app/components/ArtPreviewCard';
import { Loader } from 'app/components/atoms/Loader';
import { CustomFiltersTypes, SearchRequestTypes, useSearchPublicationsQuery } from 'graphql/generated/types';
import InfiniteScroll from 'react-infinite-scroll-component';
import config from 'utils/config';
import { hasMoreMessage } from 'utils/constant';

function Publication({ query }: any) {
  // Variables
  const request = {
    query,
    type: SearchRequestTypes.Publication,
    customFilters: [CustomFiltersTypes.Gardeners],
    limit: 10,
    sources: [config.appNameForLensApi],
  };

  const { data, loading, error, fetchMore } = useSearchPublicationsQuery({
    variables: { request },
  });

  // @ts-ignore
  const publications = data?.search?.items;

  // @ts-ignore
  const pageInfo = data?.search?.pageInfo;
  const hasMore = pageInfo?.next && publications?.length !== pageInfo.totalCount;

  const loadMore = async () => {
    await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next } },
    });
  };

  if (loading) {
    return (
      <div className="w-full h-[63vh] flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (publications?.length === 0) {
    return <div className="w-full h-[60vh] flex justify-center items-center heading-4">No Art found</div>;
  }

  return (
    <InfiniteScroll
      style={{ overflow: 'hidden' }}
      next={loadMore}
      hasMore={hasMore}
      loader={<Loader />}
      scrollThreshold={0.9}
      dataLength={publications?.length ?? 0}
    >
      <div className="grid sm:grid-cols-8 lg:grid-cols-12 gap-6 mt-10">
        {publications?.map((post: any, index: number) => (
          <div className="col-span-4" key={index}>
            <ArtPreviewCard art={post} />
          </div>
        ))}
      </div>
      {!hasMore && <div className="flex justify-center mt-10">{hasMoreMessage}</div>}
    </InfiniteScroll>
  );
}

export default Publication;
