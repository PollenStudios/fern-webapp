import ArtPreviewCard from 'app/components/ArtPreviewCard';
import { PublicationMainFocus, useExploreFeedQuery } from 'graphql/generated/types';
import config from 'utils/config';
import { Loader } from 'app/components/atoms/Loader';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { hasMoreMessage } from 'utils/constant';

export const SortPosts = ({ selectedTab, filterTags }: any) => {
  const [isLoading, setIsLoading] = useState(true);

  const filterSortCriteria = () => {
    switch (selectedTab) {
      case filterTags[0].query:
        return filterTags[0].criteria;
      case filterTags[1].query:
        return filterTags[1].criteria;
      default:
        return filterTags[0].criteria;
    }
  };

  const filterPublicationTypes = () => {
    switch (selectedTab) {
      case filterTags[0].query:
        return filterTags[0].type;
      case filterTags[1].query:
        return filterTags[1].type;
      default:
        return filterTags[0].type;
    }
  };

  // Params Sort Publications
  const request = {
    sortCriteria: filterSortCriteria(),
    publicationTypes: filterPublicationTypes(),
    noRandomize: true,
    limit: 10,
    sources: [config.appNameForLensApi],
    metadata: { mainContentFocus: [PublicationMainFocus.Image] },
    timestamp: 1,
  };

  // API Call Sort By
  const { data, loading, error, fetchMore } = useExploreFeedQuery({
    variables: { request },
  });

  // @ts-ignore
  const publications = data?.explorePublications?.items;

  // @ts-ignore
  const pageInfo = data?.explorePublications?.pageInfo;
  const hasMore = pageInfo?.next && publications?.length !== pageInfo?.totalCount;

  const loadMore = async () => {
    await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next } },
    });
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
    setIsLoading(true);
  }, [selectedTab]);

  if (loading || isLoading) {
    return (
      <div className="w-full h-[63vh] flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-container flex justify-center items-center w-full h-[92vh] heading-5">
        Failed to load discover feed
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
      <div className="grid sm:grid-cols-8 lg:grid-cols-12 gap-6 mt-20">
        {publications?.map((post: any, i: number) => (
          <div className="col-span-4" key={i}>
            <ArtPreviewCard art={post} />
          </div>
        ))}
      </div>

      {!hasMore && <div className="flex justify-center mt-10">{hasMoreMessage}</div>}
    </InfiniteScroll>
  );
};
