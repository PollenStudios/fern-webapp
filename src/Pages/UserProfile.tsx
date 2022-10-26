import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { Button } from "../Components/Atoms/Buttons";
import ImageUploader from "../Components/Atoms/UploadFiles";

import { makeAxiosRequest } from "../API/HandleApiCall";
import { PageRoutes } from "../Constants/PageRoutes";
import { tabsData } from "../Constants/Constants";
import { selectedTabsFn } from "../Util/Utility";
import TabsView from "../Components/TabsView";

function UserProfile() {
  const [bgImage, setBgImage] = useState<string[]>([]);
  const [profileImage, setProfileImage] = useState<string[]>([]);

  const [selectedTabName, setSelectedTabName] = useState("Artworks");
  const [data, setData] = useState([]);
  const [selectedTabData, setSelectedTabData] = useState([]);

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
  }, []);

  return (
    <div className="mb-10 mt-16">
      <ImageUploader parentDivClassName="w-full h-72 sm:h-96 hover:bg-gray-400" maximumFiles={3} images={bgImage} setImages={setBgImage} />
      <div className="main-container flex flex-col md:grid grid-cols-5">
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
              <Link to={PageRoutes.SETTINGS}>
                <Button variant="outline" name="Edit Profile" type={"button"} />
              </Link>
            </div>
          </div>
        </div>

        {/* TODO: fix tab view */}
        <div className="col-span-4 pt-10 md:pt-auto md:pl-36">
          <ul className="flex space-x-8 border-b border-black">
            {tabsData.map(({ tabName, id }) => (
              <TabsView selectedTabName={selectedTabName} key={id}>
                <li
                  onClick={() => setSelectedTabName(tabName)}
                  className={`cursor-pointer heading-5 sm:heading-4 border-primary ${selectedTabsFn(selectedTabName === tabName)}`}
                >
                  {tabName}
                </li>
              </TabsView>
            ))}
          </ul>


      <div className="mt-14">
        {selectedTabData.length > 0 ? (
          "Show selected tab data"
        ) : (
          <div className="flex flex-col items-center">
            <div className="h-44 w-44 rounded-full bg-gray-200 mb-4"></div>
            <h2 className="heading-4">You don’t have any Art Boards yet</h2>
            <h6 className="paragraph-3">Get started by browsing art to curate your board.</h6>
            <Link to={PageRoutes.DISCOVERY} className="mt-5">
              <Button type="button" variant="primary" name="Discover Art" />
            </Link>
          </div>
        )}
      </div>
        </div>
      </div>

    </div>
  );
}

export default UserProfile;
