import Select from 'app/components/atoms/FormElements'
import {Helmet, HelmetProvider} from 'react-helmet-async'
import {ART_CATEGORY_TITLE} from 'utils/constant'
import Publication from '../Publications'
import {SortPosts} from './SortPosts'

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
    setSelectedTab(filterTags.query)
    setSortPosts(true)
    setSelectedArtCategory(ART_CATEGORY_TITLE)
  }

  const selectedTabClass = (condition: any) => {
    if (condition) return 'border-green-10 border-b-4'
    else return ''
  }

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Discover - F3rn | Fine Art Discovery and Curation</title>
        </Helmet>
      </HelmetProvider>
      <div className='main-container min-h-[70vh] mt-24 mb-6'>
        <div className='flex flex-col sm:flex-row justify-between mt-10 mb-5'>
          <p className='heading-3 flex items-center '>Discover</p>
          {/* <div className="flex flex-col justify-end">
            <Select
              selected={selectedArtCategory}
              setSelected={setSelectedArtCategory}
              options={artCategories}
              setSortPosts={setSortPosts}
            />
          </div> */}
        </div>
        <div className='flex flex-col sm:flex-row justify-between  md:border-b'>
          <div className='flex gap-4'>
            <p
              className={`heading-5 cursor-pointer ${
                sortPosts && selectedTabClass(selectedTab === filterTags[0].query)
              }`}
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
          <div className='flex flex-col justify-end mb-2 mt-5 sm:mt-auto'>
            <Select
              selected={selectedArtCategory}
              setSelected={setSelectedArtCategory}
              options={artCategories}
              setSortPosts={setSortPosts}
            />
          </div>
        </div>

        {sortPosts && selectedArtCategory === ART_CATEGORY_TITLE ? (
          <SortPosts selectedTab={urlQueryForSort} filterTags={filterTags} />
        ) : (
          <Publication query={urlQueryForFilter} />
        )}
      </div>
    </>
  )
}

export default DiscoveryPageView
