import { checkEmpty } from "../Util/Utility";
import { HeartIcon, ArrowsRightLeftIcon, EllipsisVerticalIcon } from "@heroicons/react/24/outline";

type artPreviewCardPropsTypes = {
  name: string;
  artist: string;
  img: any;
};

const ArtPreviewCard = ({ img, name, artist }: artPreviewCardPropsTypes) => {
  return (
    <div className="w-fit mx-auto">
      <div className="bg-black rounded-3xl relative">
        <div className="absolute right-3 top-3 bg-white w-7 h-7 flex justify-center items-center rounded-full">
          <EllipsisVerticalIcon className="w-6 text-black" onClick={() => checkEmpty("Empty function")} />
        </div>
        <img className="cursor-pointer" onClick={() => checkEmpty("Empty function")} src={img} alt={name} />
        <div className="p-4 ">
          <div className=" flex justify-between">
            <h5 className="heading-6 text-white">{name}</h5>
            <div className="flex space-x-5 text-gray-300">
              <div className="flex  items-center space-x-1.5">
                <p className="font-light text-xs">124</p>
                <HeartIcon onClick={() => checkEmpty("Empty function")} className="w-4 text-white" />
              </div>
              <div className="flex  items-center space-x-1.5">
                <h6 className="font-light text-xs">33</h6>

                <ArrowsRightLeftIcon className="w-4 text-white" onClick={() => checkEmpty("Empty function")} />
              </div>
            </div>
          </div>

          <p onClick={() => checkEmpty("Empty function")} className="paragraph-3 text-gray-300 cursor-pointer pt-1.5">
            {artist}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArtPreviewCard;
