import { Link } from 'react-router-dom';
import cardImg from 'Assets/Images/artPreview.png';
import getIPFSLink from 'utils/getIPFSLink';
import { PageRoutes } from 'utils/config';
import Mirror from '../Mirror';

const ArtPreviewCard = ({ art }: any) => {
  return (
    <div className="w-[91vw] sm:w-full  rounded-xl border relative">
      <Link to={PageRoutes.ART_PREVIEW.split(':')[0] + art?.id}>
        <img
          src={art.metadata.image !== null ? getIPFSLink(art.metadata.image) : cardImg}
          alt={art.id}
          loading="lazy"
          className="cursor-pointer bg-white p-4 object-contain rounded-t-xl w-full h-96 text-white scale-95 hover:scale-100 duration-100 transform ease-out "
        />
      </Link>
      <div className="p-6 pt-4 bg-primary rounded-b-xl">
        <div className=" flex justify-between">
          <h6 className="paragraph-1 h-10 w-52 truncate text-white pt-1.5 capitalize">{art.metadata.content}</h6>
          <div className="flex space-x-1 text-gray-300 ">
            <Mirror
              publicationId={art?.id}
              mirrorCounts={art?.mirrorOf?.stats?.totalAmountOfMirrors || art.stats?.totalAmountOfMirrors}
            />
          </div>
        </div>
        <Link to={PageRoutes.ART_PREVIEW.split(':')[0] + art?.id}>
          <h5 className="paragraph-2 w-44 truncate text-white">{art.metadata.name?.split('y')[1]}</h5>
        </Link>
      </div>
    </div>
  );
};

export default ArtPreviewCard;
