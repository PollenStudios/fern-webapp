import { workInProgressAlert } from "../Util/Utility";
import { Link } from "react-router-dom";
import { PageRoutes } from "../Constants/PageRoutes";
import ArtCardDropdown from "./ArtCardDropdown";
import { HeartIcon, ArrowsRightLeftIcon } from "@heroicons/react/24/outline";

import cardImg from "../Assets/Images/artPreview.png";
import getIPFSLink from "../Lib/getIPFSLink";
const ArtPreviewCard = ({ art }: any) => {
  return (
    <>
      <div className="bg-black  rounded-3xl relative">
        <div className="absolute  right-3 top-3 bg-white w-7 h-7 flex justify-center items-center rounded-full">
          <ArtCardDropdown />
        </div>
        <Link to={PageRoutes.ART_PREVIEW}>
          {art.metadata.image ? (
            <img
              src={getIPFSLink(art.metadata.image)}
              alt={art.id}
              className="cursor-pointer object-cover rounded-t-3xl w-full h-96 text-white"
            />
          ) : (
            <img src={cardImg} alt={art.metadata.name} className="cursor-pointer object-cover rounded-t-3xl w-full h-96 text-white" />
          )}
        </Link>
        <div className="p-6 pt-4">
          <div className=" flex justify-between">
            <Link to={PageRoutes.ART_PREVIEW}>
              <h5 className="heading-5 w-44 truncate text-white">{art.metadata.name}</h5>
            </Link>
            <div className="flex space-x-1 text-gray-300 ml-6">
              <div
                onClick={() => workInProgressAlert()}
                className="flex px-1.5  hover:bg-gray-800  rounded-sm cursor-pointer  items-center space-x-1.5"
              >
                <p className="font-light text-xl">{123}</p>
                <HeartIcon className="w-6 text-white " />
              </div>
              <div
                onClick={() => workInProgressAlert()}
                className="flex px-2.5 hover:bg-gray-800 rounded-sm cursor-pointer  items-center space-x-1.5"
              >
                <h6 className="font-light text-xl ">{10}</h6>

                <ArrowsRightLeftIcon className="w-6  text-white" />
              </div>
            </div>
          </div>
          <Link to={PageRoutes.USER_PROFILE}>
            <h6 className="paragraph-2 w-fit text-gray-300 cursor-pointer pt-1.5">{art.metadata.description}</h6>
          </Link>
        </div>
      </div>
    </>
  );
};

export default ArtPreviewCard;
