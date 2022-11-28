import ArtPreviewCard from 'app/components/ArtPreviewCard';
import {
  CustomFiltersTypes,
  PublicationMainFocus,
  PublicationSortCriteria,
  PublicationTypes,
  SearchRequestTypes,
  useExploreFeedQuery,
  useSearchPublicationsQuery,
} from 'graphql/generated/types';
// import InfiniteScroll from 'react-infinite-scroll-component';
// import cardImg from '../Assets/Images/defaultLogo.png';
import { Key, useContext, useEffect, useState } from 'react';
import DiscoverySkelton from 'app/components/Skelton/DiscoverySkelton';
import { WalletContext } from 'store/WalletContextProvider';
import config from 'utils/config';
import Select from 'app/components/atoms/FormElements';
import { getArtCategories } from 'utils/generateNonce';
import { Helmet, HelmetProvider } from 'react-helmet-async';

type filterProps = {
  name: string;
  type: PublicationSortCriteria;
};

const DiscoveryPage = () => {
  const filterTags = [
    { name: 'Trending', type: PublicationSortCriteria.Latest },
    // { name: 'Popular', type: PublicationSortCriteria.TopCommented },
    // { name: 'Trending', type: PublicationSortCriteria.TopCollected },
    { name: 'Mirrored', type: PublicationSortCriteria.TopMirrored },
  ];
  const {
    currentProfileState: { currentProfile },
  }: any = useContext(WalletContext);

  // Variables
  const [publications, setPublications] = useState<any>([]);
  const [selectedArtCategory, setSelectedArtCategory] = useState<string>('Oil');
  const [selectedTagFilter, setSelectedTagFilter] = useState<filterProps>(filterTags[0]);
  const [artCategories, setArtCategories] = useState<string[]>([]);

  const request = {
    sortCriteria: selectedTagFilter.type,
    publicationTypes: [PublicationTypes.Post],
    noRandomize: true,
    limit: 20,
    sources: [config.appNameForLensApi],
    metadata: { mainContentFocus: [PublicationMainFocus.Image] },
  };

  const artRequest = {
    query: selectedArtCategory,
    type: SearchRequestTypes.Publication,
    customFilters: [CustomFiltersTypes.Gardeners],
    limit: 20,
    sources: [config.appNameForLensApi],
  };

  const reactionRequest = currentProfile ? { profileId: currentProfile?.id } : null;
  const profileId = currentProfile?.id ?? null;

  const { data, loading, error, fetchMore } = useExploreFeedQuery({
    variables: { request, reactionRequest, profileId },
  });

  const {
    data: artData,
    loading: artDataLoading,
    error: artError,
    fetchMore: fetchMoreArtData,
  } = useSearchPublicationsQuery({
    variables: { request: artRequest, reactionRequest, profileId },
  });

  const categories = async () => {
    const data = await getArtCategories();
    setArtCategories(data);
  };

  useEffect(() => {
    if (data) {
      setPublications([...data?.explorePublications?.items]);
    }
  }, [data, selectedTagFilter]);

  useEffect(() => {
    categories();
  }, []);

  useEffect(() => {
    if (artData) {
      // @ts-ignore
      artData?.search && setPublications([...artData?.search?.items]);
    }
  }, [artData, selectedArtCategory]);

  if (error || artError) {
    return (
      <div className="main-container flex justify-center items-center w-full h-[92vh] heading-5">
        Failed to load explore feed
      </div>
    );
  }

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Explore - F3rn | Fine Art Discovery and Curation</title>
        </Helmet>
      </HelmetProvider>
      <div className="main-container min-h-[76vh] mt-28 mb-12">
        <div className="flex flex-col sm:flex-row justify-between border-b my-10 pb-1 ">
          <p className="heading-4">Trending Arts</p>
          <div className="flex justify-end gap-2">
            <Select selected={selectedArtCategory} setSelected={setSelectedArtCategory} options={artCategories} />
            <Select selected={selectedTagFilter} setSelected={setSelectedTagFilter} options={filterTags} />
          </div>
        </div>
        {loading || artDataLoading ? (
          <DiscoverySkelton />
        ) : publications.length > 0 ? (
          <div className="grid sm:grid-cols-8 lg:grid-cols-12 gap-6 mt-20">
            {publications?.map((post: any, index: Key | null | undefined) => (
              <div className="col-span-4" key={index}>
                <ArtPreviewCard art={post} />
              </div>
            ))}
          </div>
        ) : (
          <div className="main-container h-[60vh] w-full flex justify-center items-center">No posts yet!</div>
        )}
      </div>
    </>
  );
};

export default DiscoveryPage;
