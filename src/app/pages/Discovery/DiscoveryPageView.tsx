import Select from 'app/components/atoms/FormElements';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Publication from '../Publications';
import { SortPosts } from './SortPosts';

const DiscoveryPageView = ({
  selectedArtCategory,
  setSelectedArtCategory,
  artCategories,
  filterTags,
  selectedTab,
  setSelectedTab,
  sortPosts,
  setSortPosts,
  urlQueryForSort,
  urlQueryForFilter,
}: any) => {
  const handleTabClick = (filterTags: any) => {
    setSelectedTab(filterTags.query);
    setSortPosts(true);
    setSelectedArtCategory('All');
  };

  const selectedTabClass = (condition: any) => {
    if (condition) return 'border-primary border-b-4';
    else return '';
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Discover - F3rn | Fine Art Discovery and Curation</title>
        </Helmet>
      </HelmetProvider>
      <div className="main-container min-h-[76vh] mt-28 mb-12">
        <div className="flex flex-col sm:flex-row justify-between mt-10 mb-5">
          <p className="heading-3 flex items-center">Discover</p>
          <div className="flex flex-col justify-end">
            <p className="paragraph-2 pl-4">Set Category</p>
            <Select
              selected={selectedArtCategory}
              setSelected={setSelectedArtCategory}
              options={artCategories}
              setSortPosts={setSortPosts}
            />
          </div>
        </div>
        <div className="flex gap-4 border-b">
          <p
            className={`heading-5 cursor-pointer ${sortPosts && selectedTabClass(selectedTab === filterTags[0].query)}`}
            onClick={() => handleTabClick(filterTags[0])}
          >
            {filterTags[0].name}
          </p>
          <p
            className={`heading-5 cursor-pointer 
               ${sortPosts && selectedTabClass(selectedTab === filterTags[1].query)}`}
            onClick={() => handleTabClick(filterTags[1])}
          >
            {filterTags[1].name}
          </p>
        </div>

        {sortPosts && selectedArtCategory === 'All' ? (
          <SortPosts selectedTab={urlQueryForSort} filterTags={filterTags} />
        ) : (
          <Publication query={urlQueryForFilter} />
        )}
      </div>
    </>
  );
};

export default DiscoveryPageView;
