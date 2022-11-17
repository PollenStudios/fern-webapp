import ArtPreviewCard from 'app/components/ArtPreviewCard';
import {
  ExploreFeedDocument,
  PublicationMainFocus,
  PublicationSortCriteria,
  PublicationTypes,
} from 'graphql/generated/types';
import { useQuery } from '@apollo/client';

// import cardImg from '../Assets/Images/defaultLogo.png';
import DiscoverySkelton from 'app/components/Skelton/DiscoverySkelton';
import config from 'utils/config';
const DiscoveryPage = () => {
  // Variables
  const request = {
    sortCriteria: PublicationSortCriteria.Latest,
    publicationTypes: [PublicationTypes.Post],
    noRandomize: true,
    limit: 20,
    sources: [config.APP_NAME_FOR_LENS_API],
    metadata: { mainContentFocus: [PublicationMainFocus.Image] },
  };
  const { data } = useQuery(ExploreFeedDocument, {
    variables: { request },
  });

  return (
    <div>
      {data ? (
        <div className="main-container min-h-[76vh] mt-28 mb-12">
          <p className="border-b my-10 pb-1 heading-4">Trending Arts</p>
          <div className="grid sm:grid-cols-8 lg:grid-cols-12 gap-6 mt-20">
            {data?.explorePublications.items.map((post, index) => (
              <div className="col-span-4" key={index}>
                <ArtPreviewCard art={post} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <DiscoverySkelton />
      )}
    </div>
  );
};

export default DiscoveryPage;
