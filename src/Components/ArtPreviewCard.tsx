import { workInProgressAlert } from "../Util/Utility";
import { Link } from "react-router-dom";
import { PageRoutes } from "../Constants/PageRoutes";
import ArtCardDropdown from "./ArtCardDropdown";
import { HeartIcon, ArrowsRightLeftIcon } from "@heroicons/react/24/outline";

const ArtPreviewCard = ({ img, artName, artistName, likes, share }: artworkCardPropsTypes) => {
  return (
    <>
      <div className="bg-black  rounded-3xl relative">
        <div className="absolute  right-3 top-3 bg-white w-7 h-7 flex justify-center items-center rounded-full">
          <ArtCardDropdown />
        </div>
        <Link to={PageRoutes.ART_PREVIEW}>
          <img className="cursor-pointer object-cover rounded-t-3xl w-full h-96 text-white" src={img} alt={artName} />
        </Link>
        <div className="p-6 pt-4">
          <div className=" flex justify-between">
            <Link to={PageRoutes.ART_PREVIEW}>
              <h5 className="heading-5 w-44 truncate text-white">{artName}</h5>
            </Link>
            <div className="flex space-x-1 text-gray-300 ml-6">
              <div
                onClick={() => workInProgressAlert()}
                className="flex px-1.5  hover:bg-gray-800  rounded-sm cursor-pointer  items-center space-x-1.5"
              >
                <p className="font-light text-xl">{likes}</p>
                <HeartIcon className="w-6 text-white " />
              </div>
              <div
                onClick={() => workInProgressAlert()}
                className="flex px-2.5 hover:bg-gray-800 rounded-sm cursor-pointer  items-center space-x-1.5"
              >
                <h6 className="font-light text-xl ">{share}</h6>

                <ArrowsRightLeftIcon className="w-6  text-white" />
              </div>
            </div>
          </div>

          <h6 onClick={() => workInProgressAlert()} className="paragraph-2 w-fit text-gray-300 cursor-pointer pt-1.5">
            {artistName}
          </h6>
        </div>
      </div>
    </>
  );
};

export default ArtPreviewCard;
