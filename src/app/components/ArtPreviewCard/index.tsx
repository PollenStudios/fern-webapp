import { workInProgressAlert } from 'utils/utility';
import { Link } from 'react-router-dom';
import { HeartIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline';

import cardImg from 'Assets/Images/artPreview.png';
import getIPFSLink from 'utils/getIPFSLink';
import { PageRoutes } from 'utils/config';

const ArtPreviewCard = ({ art }: any) => {
  return (
    <div className="w-[91vw] sm:w-full  rounded-xl border relative">
      <Link to={PageRoutes.ART_PREVIEW.split(':')[0] + art?.id}>
        <img
          src={art.metadata.image !== null ? getIPFSLink(art.metadata.image) : cardImg}
          alt={art.id}
          className="cursor-pointer bg-white p-4 object-contain rounded-t-xl w-full h-96 text-white scale-100 duration-100 hover:scale-105 transform ease-out"
        />
      </Link>
      <div className="p-6 pt-4 bg-black">
        <div className=" flex justify-between">
          <h6 className="paragraph-1 h-10 w-52 truncate text-white pt-1.5 capitalize">{art.metadata.content}</h6>
          {/* <div className="flex space-x-1 text-gray-300 ">
            <div
              onClick={() => workInProgressAlert()}
              className="flex px-1 hover:bg-gray-800  rounded-sm cursor-pointer  items-center space-x-1"
            >
              <p className="paragraph-2">{123}</p>
              <HeartIcon className="w-5 text-white " />
            </div>
            <div
              onClick={() => workInProgressAlert()}
              className="flex px-1 hover:bg-gray-800 rounded-sm cursor-pointer  items-center space-x-1"
            >
              <h6 className="paragraph-2">{10}</h6>

              <ArrowsRightLeftIcon className="w-5  text-white" />
            </div>
          </div> */}
        </div>
        <Link to={PageRoutes.ART_PREVIEW.split(':')[0] + art?.id}>
          <h5 className="paragraph-2 w-44 truncate text-white">{art.metadata.name?.split('y')[1]}</h5>
        </Link>
      </div>
    </div>
  );
};

export default ArtPreviewCard;
