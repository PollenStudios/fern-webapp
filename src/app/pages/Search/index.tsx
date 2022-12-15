import { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Publication from '../Publications';
import Profiles from '../UserProfile/SearchedProfiles';

function Search() {
  const [selectedTab, setSelectedTab] = useState('publications');
  let query = new URLSearchParams(useLocation().search).get('q');
  const navigate = useNavigate();

  useEffect(() => {
    selectedTab === 'publications'
      ? navigate(`/search?q=${query}&type=publications`)
      : navigate(`/search?q=${query}&type=profiles`);
  }, [selectedTab]);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Search - F3rn | Fine Art Discovery and Curation</title>
        </Helmet>
      </HelmetProvider>
      <div className="main-container min-h-[70vh] mt-20 mb-6">
        <div className=" pt-5 mb-4 flex gap-1 items-baseline">
          <p className="paragraph-1">Showing results of</p>
          <p className="heading-5">{query}</p>
        </div>
        <div className="flex gap-4 border-b">
          <p
            className={`heading-5 cursor-pointer pb-4 ${
              selectedTab === 'publications' ? 'border-primary border-b-4' : ''
            }`}
            onClick={() => setSelectedTab('publications')}
          >
            Art
          </p>
          <p
            className={`heading-5 cursor-pointer pb-4 ${selectedTab === 'profiles' ? 'border-primary border-b-4' : ''}`}
            onClick={() => setSelectedTab('profiles')}
          >
            User Profile
          </p>
        </div>
        {selectedTab === 'publications' && <Publication query={query} />}
        {selectedTab === 'profiles' && <Profiles query={query} />}
      </div>
    </>
  );
}

export default Search;
