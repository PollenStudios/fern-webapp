import { Key, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'app/components/atoms/Buttons';
import { WalletContext } from 'store/WalletContextProvider';

import defaultLogo from 'Assets/Images/defaultLogo.png';
import useGetRecommendedProfiles from 'hooks/useGetRecommendedProfiles';
import FullPageLoader from 'app/components/FullPageLoader';
import ScrollTop from 'app/components/ScrollTop';
import { PageRoutes } from 'utils/config';

const HomePage = () => {
  const navigate = useNavigate();
  // const { recommendedProfilesData, setRecommendedProfilesData }: any = useContext(WalletContext);

  const { recommendedProfiles, loading, error } = useGetRecommendedProfiles();

  // useEffect(() => {
  //   setRecommendedProfilesData(recommendedProfiles);
  // }, [recommendedProfiles]);

  if (loading === true) return <FullPageLoader />;

  if (error !== null)
    return (
      <div className="main-container">
        <div className="mt-14">
          <div className="h-screen w-full flex flex-col justify-center items-center">
            <h1 className="heading-2 sm:heading-1 mb-5 text-red-700">{error.message}</h1>
          </div>
        </div>
      </div>
    );

  if (recommendedProfiles === undefined || recommendedProfiles.length === 0)
    return (
      <div className="main-container">
        <div className="mt-14">
          <div className="h-screen w-full flex flex-col justify-center items-center">
            <h1 className="heading-2 sm:heading-1 mb-5">No Profiles yet..</h1>
            <Button name="Discover Art" onClick={() => navigate(PageRoutes.DISCOVERY)} />
          </div>
        </div>
      </div>
    );
  return (
    <div className="main-container">
      <ScrollTop />
      <div className="mt-14">
        {recommendedProfiles.map((profile: any, i: Key) => (
          <div
            key={i}
            className="py-10 grid grid-cols-12 gap-8 md:gap-10 border-b-2 cursor-pointer shadow-xl rounded-lg md:rounded-none md:shadow-none hover:shadow-xl hover:rounded-xl"
          >
            <div className="w-24 h-24 md:w-40 md:h-40 col-span-4 md:col-span-3">
              {profile.picture ? (
                <img
                  src={profile.picture.original?.url}
                  alt={profile.name}
                  className="object-cover w-full h-full rounded-full ml-2 md:ml-10"
                />
              ) : (
                <img
                  src={defaultLogo}
                  alt={profile.name}
                  className="object-cover w-full h-full rounded-full ml-2 md:ml-10"
                />
              )}
            </div>
            <div className="col-span-8 md:col-span-9">
              <h2 className="sub-heading mb-1 md:mb-2">{profile.name}</h2>
              <h4>{profile.handle}</h4>
              <p>{profile.bio}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
