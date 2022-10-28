import { Key, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../Components/Atoms/Buttons";
import { PageRoutes } from "../Constants/PageRoutes";
import { WalletContext } from "../Context/WalletContextProvider";

import defaultLogo from "../Assets/Images/defaultlogo.png";
const HomePage = () => {
  const navigate = useNavigate();
  const { recommendedProfilesData }: any = useContext(WalletContext);
  return (
    <div className="main-container">
      {recommendedProfilesData ? (
        <div className="mt-14">
          {recommendedProfilesData.map((profile: any, i: Key) => (
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
                  <img src={defaultLogo} alt={profile.name} className="object-cover w-full h-full rounded-full ml-2 md:ml-10" />
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
      ) : (
        <div className="h-screen w-full flex flex-col justify-center items-center">
          <h1 className="heading-2 sm:heading-1 mb-5">Coming Soon</h1>
          <Button name="Discover Art" onClick={() => navigate(PageRoutes.DISCOVERY)} />
        </div>
      )}
    </div>
  );
};

export default HomePage;
