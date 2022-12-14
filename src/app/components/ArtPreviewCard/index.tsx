import { Link } from 'react-router-dom';
import cardImg from 'Assets/Images/artPreview.png';
import getIPFSLink from 'utils/getIPFSLink';
import { PageRoutes } from 'utils/config';
import Mirror from '../Mirror';
import Like from '../Like';
import { EllipsisVerticalIcon, TrashIcon } from '@heroicons/react/24/solid';
import { useContext, useState } from 'react';
import { WalletContext } from 'store/WalletContextProvider';
import { DeleteModal } from '../Delete';

const ArtPreviewCard = ({ art }: any) => {
  const {
    currentProfileState: { currentProfile },
  }: any = useContext(WalletContext);

  const [openList, setOpenList] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openDeleteModal = () => {
    setIsModalOpen(true);
  };

  const isMirror = art?.__typename === 'Mirror';

  return (
    <>
      <DeleteModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} publication={art} />
      <div className="w-[91vw] sm:w-full  rounded-xl border relative">
        {currentProfile?.id ===
          // @ts-ignore
          (isMirror ? art?.mirrorOf?.profile?.id : art?.profile?.id) && (
          <div className="absolute top-3 right-2 flex justify-end cursor-pointer ">
            <EllipsisVerticalIcon
              className="z-10 w-6 h-6 hover:bg-gray-30 hover:rounded-full"
              onClick={() => setOpenList(!openList)}
            />
            {openList && (
              <div
                className="text-red-700 z-10 absolute top-8 right-3 bg-gray-30 rounded-lg w-20 h-10 flex justify-center items-center"
                onClick={openDeleteModal}
              >
                {/* <TrashIcon className="w-5 h-5" /> */}
                Delete
              </div>
            )}
          </div>
        )}
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
            <h6 className="font-inter font-semibold text-xl leading-snug -tracking-tightest h-10 w-52 truncate text-white pt-1.5 capitalize">
              {art.metadata.content}
            </h6>
            <div className="flex items-center gap-1 text-gray-300 ">
              {/* TODO: explore publication api reaction is coming null but we exprect UPVOTE for liked posts, need to discuss DISCORD */}
              <Like publication={art} />
              <Mirror
                publicationId={art?.id}
                mirrorCounts={art?.mirrorOf?.stats?.totalAmountOfMirrors || art.stats?.totalAmountOfMirrors}
              />
            </div>
          </div>
          <Link to={PageRoutes.ART_PREVIEW.split(':')[0] + art?.id}>
            <h5 className="heading-6 w-44 truncate text-gray-300">{art.metadata.name?.split('y')[1]}</h5>
          </Link>
        </div>
      </div>
    </>
  );
};

export default ArtPreviewCard;
