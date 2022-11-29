import { PublicationSortCriteria } from 'graphql/generated/types';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getArtCategories } from 'utils/generateNonce';
import DiscoveryPageView from './DiscoveryPageView';
// import InfiniteScroll from 'react-infinite-scroll-component';

// type FilterProps = {
//   name: string;
//   query: string;
//   type: PublicationSortCriteria;
// };

const DiscoveryPage = () => {
  let urlQueryForSort = new URLSearchParams(useLocation().search).get('sortBy');
  let urlQueryForFilter = new URLSearchParams(useLocation().search).get('filteredBy');
  const navigate = useNavigate();

  //Filter Tags
  const filterTags = [
    { name: 'Latest', query: 'Latest', type: PublicationSortCriteria.Latest },
    { name: 'Curated Art', query: 'curated-art', type: PublicationSortCriteria.TopMirrored },
  ];

  // Variables
  const [selectedTab, setSelectedTab] = useState<string>(urlQueryForSort || filterTags[0].query);
  const [selectedArtCategory, setSelectedArtCategory] = useState<string>(urlQueryForFilter || 'All');
  // const [selectedArtCategory, setSelectedArtCategory] = useState<string>('All');

  const [artCategories, setArtCategories] = useState<string[]>([]);
  const [sortPosts, setSortPosts] = useState<boolean>(true);

  const fetchArtCategoriesFromBackend = async () => {
    const data = await getArtCategories();
    data.unshift('All');
    setArtCategories(data);
  };

  useEffect(() => {
    fetchArtCategoriesFromBackend();
  }, []);

  useEffect(() => {
    if (selectedArtCategory === 'All') {
      navigate(`/discover?sortBy=${selectedTab}`);
    } else {
      navigate(`/discover?filteredBy=${selectedArtCategory}`);
      setSortPosts(false);
    }
  }, [selectedArtCategory, selectedTab]);

  return (
    <DiscoveryPageView
      selectedArtCategory={selectedArtCategory}
      setSelectedArtCategory={setSelectedArtCategory}
      artCategories={artCategories}
      filterTags={filterTags}
      selectedTab={selectedTab}
      setSelectedTab={setSelectedTab}
      sortPosts={sortPosts}
      setSortPosts={setSortPosts}
      urlQueryForSort={urlQueryForSort}
      urlQueryForFilter={urlQueryForFilter}
    />
  );
};

export default DiscoveryPage;
