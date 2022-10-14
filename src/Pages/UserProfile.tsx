import React, { useState } from "react";
import NoArtBoards from "../Assets/Images/noArtBoards.png";
import { Button } from "../Components/Atoms/Buttons";
import ImageUploader from "../Components/Atoms/UploadFiles";

function UserProfile() {
  const [bgImage, setBgImage] = useState([]);
  const [profileImage, setProfileImage] = useState([]);
  return (
    <div className="mb-10 mt-16">
      <ImageUploader className="w-full h-96" maximumFiles={3} files={bgImage} setFiles={setBgImage} />

      <div className="relative main-container flex flex-col md:grid grid-cols-5">
        <div className="col-span-1">
          <ImageUploader
            className="rounded-full w-48 h-48 absolute -top-24 border-4 border-white  md:left-12"
            additionalClasses="rounded-full object-cover"
            maximumFiles={1}
            files={profileImage}
            setFiles={setProfileImage}
          />
          <div className="flex justify-center flex-col w-40 md:w-60">
            <p className="heading-5 text-center pt-28 pb-5">0x6fDFab3...8Fa7</p>
            <div className="text-center">
              <Button variant="outline" name="Edit Profile" type={undefined} onClick={undefined} />
            </div>
          </div>
        </div>
        <div className="col-span-4 pt-10 md:pt-auto md:pl-36">
          <p className="heading-4 border-b-4 w-44 border-primary">Art Boards</p>
          <div className="flex flex-col items-center justify-center py-16 md:py-28 gap-5 border-t border-primary">
            <img src={NoArtBoards} className="rounded-full w-80 h-80 md:w-96 md:h-96 " />
            <p className="heading-4 text-center">You don’t have any Art Boards yet</p>
            <p className="paragraph-1 text-center">Get started by browsing art to curate your board.</p>
            <Button variant="primary" name="Discover Art" type={undefined} onClick={undefined} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
