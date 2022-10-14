import { checkEmpty } from "../Util/Utility";

import ArtCardDropdown from "./ArtCardDrpdown";

import { HeartIcon, ArrowsRightLeftIcon } from "@heroicons/react/24/outline";

const ArtPreviewCard = ({ img, artName, artistName, likes, share }: artworkCardPropsTypes) => {
  return (
    <>
      <div className="w-fit mx-auto">
        <div className="bg-black rounded-3xl relative">
          <div className="absolute right-3 top-3 bg-white w-7 h-7 flex justify-center items-center rounded-full">
            <ArtCardDropdown />
          </div>
          <img className="cursor-pointer" onClick={() => checkEmpty("Empty function")} src={img} alt={artName} />
          <div className="p-4 ">
            <div className=" flex justify-between">
              <h5 className="heading-6 text-white">{artName}</h5>
              <div className="flex space-x-5 text-gray-300">
                <div className="flex  items-center space-x-1.5">
                  <p className="font-light text-xs">{likes}</p>
                  <HeartIcon onClick={() => checkEmpty("Empty function")} className="w-4 text-white cursor-pointer" />
                </div>
                <div className="flex  items-center space-x-1.5">
                  <h6 className="font-light text-xs">{share}</h6>

                  <ArrowsRightLeftIcon className="w-4 cursor-pointer text-white" onClick={() => checkEmpty("Empty function")} />
                </div>
              </div>
            </div>

            <h6 onClick={() => checkEmpty("Empty function")} className="paragraph-3 text-gray-300 cursor-pointer pt-1.5">
              {artistName}
            </h6>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArtPreviewCard;
