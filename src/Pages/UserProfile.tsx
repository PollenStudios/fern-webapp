import { useState, useEffect } from "react";

import { Button } from "../Components/Atoms/Buttons";
import ImageUploader from "../Components/Atoms/UploadFiles";
import TabsView from "../Components/TabsView";

import { makeAxiosRequest } from "../API/HandleApiCall";
import { selectedTabsFn } from "../Util/Utility";
import { tabsData } from "../Constants/Constants";
import NoArtBoards from "../Assets/Images/noArtBoards.png";

function UserProfile() {
  const [bgImage, setBgImage] = useState<string[]>([]);
  const [profileImage, setProfileImage] = useState<string[]>([]);

  const [selectedTabName, setSelectedTabName] = useState("Artworks");
  const [data, setData] = useState([]);

  async function getDataFromApi() {
    const body = {
      name: "morpheus",
      job: "leader",
    };

    const response = await makeAxiosRequest("GET", "/eventartist/?related_events=true");
    const responseData = response?.data;
    const dataResults = responseData?.results;

    setData(dataResults);
  }

  useEffect(() => {
    getDataFromApi();
    console.log("get data");
  }, []);

  return (
    <div className="mb-10 mt-16">
      <ImageUploader parentDivClassName="w-full h-72 sm:h-96 hover:bg-gray-400" maximumFiles={3} images={bgImage} setImages={setBgImage} />
      <div className=" main-container flex flex-col md:grid grid-cols-5">
        <div className="col-span-1 relative text-center">
          <ImageUploader
            parentDivClassName="rounded-full w-48 h-48 absolute -top-24 border-4 border-white md:left-6 hover:bg-gray-400"
            imageClassName="rounded-full object-cover"
            maximumFiles={1}
            images={profileImage}
            setImages={setProfileImage}
          />
          <div className="flex justify-center flex-col w-40 md:w-60 pl-8 sm:pl-0">
            <p className=" heading-6 sm:heading-5 text-center pt-28 pb-5">0x6fDFab3...8Fa7</p>
            <div className="sm:ml-6 md:ml-0">
              <Button variant="outline" name="Edit Profile" type={"button"} />
            </div>
          </div>
        </div>
        <div className="col-span-4 pt-10 md:pt-auto md:pl-36">
          <ul className="flex space-x-8 border-b border-black">
            {tabsData.map(({ tabName }) => (
              <TabsView selectedTabName={selectedTabName}>
                <li
                  key={tabName}
                  onClick={() => setSelectedTabName(tabName)}
                  className={`cursor-pointer heading-5 sm:heading-4 border-primary ${selectedTabsFn(selectedTabName === tabName)}`}
                >
                  {tabName}
                </li>
              </TabsView>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
