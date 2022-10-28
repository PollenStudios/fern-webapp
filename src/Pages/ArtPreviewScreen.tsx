import ART_PREVIEW from "../Assets/Images/artPreview.png";
import { ArrowsRightLeftIcon, ArrowLongRightIcon } from "@heroicons/react/24/outline";
import { HeartIcon } from "@heroicons/react/24/solid";

import { TextArea } from "../Components/Atoms/FormElements";
import { useForm } from "react-hook-form";

const ArtPreviewScreen = () => {
  const { register } = useForm();
  return (
    <div>
      <div className="main-container my-24">
        <div className="grid grid-cols-6 gap-6">
          <div className="col-span-6 md:col-span-3 ">
            <img className=" object-cover w-full  h-[600px]" src={ART_PREVIEW} alt="Artwork by Nnaemeka Ekwelum" />
          </div>
          <div className="col-span-6 md:col-span-3">
            <div className="flex flex-col justify-center">
              <h1 className="heading-3">Archaeology</h1>
              <a className="text-gray-700 border-b pb-2 border-gray-500" href="/">
                @Juliette Hayt Greenberg
              </a>
              <p className="paragraph-1 lg:w-4/5  leading-loose pt-5 text-gray-500">
                I was born hungry to understand the human mind and body. My yearnings never stopped. My childhood exploration of life began
                with studying The Atlas of Human Anatomy and Surgery, which evolved into drawing the body both inside and out—my daily
                ritual.{" "}
              </p>
            </div>

            <div className="mt-14 md:mt-20 lg:mt-28">
              <div className="flex space-x-4">
                <HeartIcon className="w-6" />
                <ArrowsRightLeftIcon className="w-6" />
              </div>

              <TextArea
                type="text"
                name="explain_about_yourself"
                label=""
                placeholder="Comment Here..."
                register={register}
                required
                rows={4}
              />
              <ArrowLongRightIcon className="w-8 ml-auto -mt-8 mr-2"/>

             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtPreviewScreen;
