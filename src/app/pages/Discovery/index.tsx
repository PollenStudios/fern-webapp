import {PublicationSortCriteria, PublicationTypes} from 'graphql/generated/types'
import {useEffect, useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import {ART_CATEGORY_TITLE} from 'utils/constant'
import {getArtCategories} from 'utils/generateNonce'
import DiscoveryPageView from './DiscoveryPageView'

// type FilterProps = {
//   name: string;
//   query: string;
//   criteria: PublicationSortCriteria;
// };

const DiscoveryPage = () => {
  let urlQueryForSort = new URLSearchParams(useLocation().search).get('sortBy')
  let urlQueryForFilter = new URLSearchParams(useLocation().search).get('filteredBy')
  const navigate = useNavigate()

  //Filter Tags
  const filterTags = [
    {
      name: 'Latest',
      query: 'Latest',
      criteria: PublicationSortCriteria.Latest,
      type: PublicationTypes.Post,
    },
    {
      name: 'Curated Art',
      query: 'curated-art',
      criteria: PublicationSortCriteria.TopMirrored,
      type: PublicationTypes.Mirror,
    },
  ]

  // Variables
  const [selectedTab, setSelectedTab] = useState<string>(urlQueryForSort || filterTags[0].query)
  const [selectedArtCategory, setSelectedArtCategory] = useState<string>(
    urlQueryForFilter || ART_CATEGORY_TITLE,
  )

  const [artCategories, setArtCategories] = useState<string[]>([])
  const [sortPosts, setSortPosts] = useState<boolean>(true)

  const fetchArtCategoriesFromBackend = async () => {
    const data = await getArtCategories()
    data.unshift(ART_CATEGORY_TITLE)
    setArtCategories(data)
  }

  useEffect(() => {
    fetchArtCategoriesFromBackend()
  }, [])

  useEffect(() => {
    if (urlQueryForSort !== null) {
      setSelectedTab(urlQueryForSort ?? 'Latest')
    }
  }, [urlQueryForSort])

  useEffect(() => {
    if (selectedArtCategory === ART_CATEGORY_TITLE) {
      navigate(`/discover?sortBy=${selectedTab}`)
    } else {
      navigate(`/discover?filteredBy=${selectedArtCategory}`)
      setSortPosts(false)
    }
  }, [selectedArtCategory, selectedTab])

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
  )
}

export default DiscoveryPage
