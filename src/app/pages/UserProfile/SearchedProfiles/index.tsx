import { CustomFiltersTypes, SearchRequestTypes, useSearchProfilesQuery } from 'graphql/generated/types';
import { Link } from 'react-router-dom';
import config, { PageRoutes } from 'utils/config';
import cardImg from 'Assets/Images/artPreview.png';
import { Loader } from 'app/components/atoms/Loader';
import InfiniteScroll from 'react-infinite-scroll-component';
import { hasMoreMessage } from 'utils/constant';

function Profiles({ query }: any) {
  // Variables
  const request = {
    query,
    type: SearchRequestTypes.Profile,
    customFilters: [CustomFiltersTypes.Gardeners],
    limit: 10,
    sources: [config.appNameForLensApi],
  };

  const { data, loading, error, fetchMore } = useSearchProfilesQuery({
    variables: { request },
    skip: !query,
  });

  // @ts-ignore
  const profiles = data?.search?.items;

  // @ts-ignore
  const pageInfo = data?.search?.pageInfo;
  const hasMore = pageInfo?.next && profiles?.length !== pageInfo.totalCount;

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

  if (profiles?.length === 0) {
    return <div className="w-full h-[60vh] flex justify-center items-center heading-4">No Profile found</div>;
  }

  console.log(hasMore);

  return (
    <InfiniteScroll
      style={{ overflow: 'hidden' }}
      next={loadMore}
      hasMore={hasMore}
      loader={<Loader myClass="mt-5" />}
      scrollThreshold={0.9}
      dataLength={profiles?.length ?? 0}
    >
      <div className="grid grid-cols-6 md:grid-cols-12 gap-3 sm:gap-5 mt-10">
        {profiles?.map((profile: any, index: number) => (
          <div className="col-span-6" key={index}>
            <Link to={PageRoutes.USER_PROFILE.split(':')[0] + profile?.id}>
              <div className="rounded-xl border flex hover:border hover:border-primary hover:shadow-sm">
                <div className="md:w-40 md:h-40 sm:w-32 sm:h-32 w-24 h-24 p-3 sm:p-4">
                  <img
                    src={profile?.picture !== null ? profile?.picture?.original?.url : cardImg}
                    alt={profile.id}
                    className="cursor-pointer rounded-full bg-white object-cover w-full h-full text-white"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col justify-center ml-2">
                  <h6 className="paragraph-2 sm:paragraph-1 truncate capitalize text-primary">
                    {profile.name ?? profile.id}
                  </h6>

                  <h5 className="paragraph-3 sm:paragraph-2  w-32 sm:w-44 truncate text-primary">{profile.handle}</h5>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      {/* @ts-ignore */}
      {!hasMore && profiles?.length > 10 && <div className="flex justify-center mt-10">{hasMoreMessage}</div>}
    </InfiniteScroll>
  );
}

export default Profiles;
// max-h-24 max-w-[96px] sm:max-h-full sm:max-w-full
