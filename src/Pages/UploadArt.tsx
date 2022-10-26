import { Input, TextArea } from "../Components/Atoms/FormElements";

import { useForm } from "react-hook-form";
import { useState } from "react";
import ImageUploader from "../Components/Atoms/UploadFiles";

const UploadArt = () => {
  const { register } = useForm();
  const [profileImage, setProfileImage] = useState<any[]>([]);

  return (
    <div>
      <div className="main-container my-24">
        <div className="grid grid-cols-6 gap-6">
          <div className="col-span-6 md:col-span-3 ">
            <ImageUploader
              parentDivClassName="w-full h-[250px] sm:h-[500px] hover:bg-gray-400"
              maximumFiles={3}
              images={profileImage}
              setImages={setProfileImage}
            />

            {/* <img className=" object-cover w-full  h-[500px]" src={ART_PREVIEW} alt="Artwork by Nnaemeka Ekwelum" /> */}
          </div>
          <div className="col-span-6 md:col-span-3 mt-2 space-y-5">
            <Input type="text" name="username" label="Name" placeholder="Juliette Hayt" register={register} required />
            <TextArea type="text" name="explain_about_yourself" label="Bio" placeholder="" register={register} required />

            <Input type="email" name="username" label="Year" placeholder="juliettehayt@gmail.com  " register={register} required />

            <Input type="text" name="username" label="Medium" placeholder="Oil Painting" register={register} required />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadArt;
