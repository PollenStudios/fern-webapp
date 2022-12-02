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
      loader={<Loader />}
      scrollThreshold={0.9}
      dataLength={profiles?.length ?? 0}
    >
      <div className="grid sm:grid-cols-8 lg:grid-cols-12 gap-6 mt-10">
        {profiles?.map((profile: any, index: number) => (
          <div className="col-span-6" key={index}>
            <Link to={PageRoutes.USER_PROFILE.split(':')[0] + profile?.id}>
              <div className="rounded-xl border flex hover:border hover:border-primary hover:shadow-sm">
                <div className="w-40 h-40 p-4">
                  <img
                    src={profile?.picture !== null ? profile?.picture?.original?.url : cardImg}
                    alt={profile.id}
                    className="cursor-pointer rounded-full bg-white object-cover w-full h-full text-white "
                  />
                </div>
                <div className="p-6 pt-4 flex flex-col justify-center">
                  <h6 className="paragraph-1 truncate capitalize text-primary">{profile.name ?? profile.id}</h6>

                  <h5 className="paragraph-2 w-44 truncate text-primary">{profile.handle}</h5>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      {!hasMore && <div className="flex justify-center mt-10">{hasMoreMessage}</div>}
    </InfiniteScroll>
  );
}

export default Profiles;
