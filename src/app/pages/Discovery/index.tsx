import { PublicationSortCriteria, PublicationTypes } from 'graphql/generated/types';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getArtCategories } from 'utils/generateNonce';
import DiscoveryPageView from './DiscoveryPageView';

// type FilterProps = {
//   name: string;
//   query: string;
//   criteria: PublicationSortCriteria;
// };

const DiscoveryPage = () => {
  let urlQueryForSort = new URLSearchParams(useLocation().search).get('sortBy');
  let urlQueryForFilter = new URLSearchParams(useLocation().search).get('filteredBy');
  const navigate = useNavigate();

  //Filter Tags
  const filterTags = [
    { name: 'Latest', query: 'Latest', criteria: PublicationSortCriteria.Latest, type: PublicationTypes.Post },
    {
      name: 'Curated Art',
      query: 'curated-art',
      criteria: PublicationSortCriteria.TopMirrored,
      type: PublicationTypes.Mirror,
    },
  ];

  // Variables
  const [selectedTab, setSelectedTab] = useState<string>(urlQueryForSort || filterTags[0].query);
  const [selectedArtCategory, setSelectedArtCategory] = useState<string>(urlQueryForFilter || 'Category');
  // const [selectedArtCategory, setSelectedArtCategory] = useState<string>('Category');

  const [artCategories, setArtCategories] = useState<string[]>([]);
  const [sortPosts, setSortPosts] = useState<boolean>(true);

  const fetchArtCategoriesFromBackend = async () => {
    const data = await getArtCategories();
    data.unshift('Category');
    setArtCategories(data);
  };

  useEffect(() => {
    fetchArtCategoriesFromBackend();
  }, []);

  useEffect(() => {
    if (selectedArtCategory === 'Category') {
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
