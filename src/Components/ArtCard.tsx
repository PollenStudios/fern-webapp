import { ListIcon, ArrowLeftRight, HeartIcon } from "./Icons";
import { checkEmpty } from "../Util/Utility";
import { ShareIcon } from "@heroicons/react/24/outline";

type cardProps = {
  name: string;
  artist: string;
  img: any;
};

const ArtCard = ({ img, name, artist }: cardProps) => {
  return (
    <div className="w-fit mx-auto">
      <div className="bg-black rounded-3xl relative">
        <div className="absolute right-3 top-3 bg-white w-7 h-7 flex justify-center items-center rounded-full">
          <a className="cursor-pointer" onClick={() => checkEmpty("Empty function")} href="/">
            <ListIcon />
          </a>
        </div>
        <img className="cursor-pointer" onClick={() => checkEmpty("Empty function")} src={img} alt={name} />
        <div className="p-4 ">
          <div className=" flex justify-between">
            <h5 className="heading-6 text-white">{name}</h5>
            <div className="flex space-x-5 text-gray-300">
              <div className="flex space-x-1.5">
                <p className="font-light text-xs">124</p>
                <a href="/" onClick={() => checkEmpty("Empty function")}>
                  <ShareIcon />
                </a>
              </div>
              <div className="flex space-x-1.5">
                <h6 className="font-light text-xs">33</h6>
                <a href="/" onClick={() => checkEmpty("Empty function")}>
                  <ArrowLeftRight />
                </a>
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

export default ArtCard;
