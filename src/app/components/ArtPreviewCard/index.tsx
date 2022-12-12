import { Link } from 'react-router-dom';
import cardImg from 'Assets/Images/artPreview.png';
import getIPFSLink from 'utils/getIPFSLink';
import { PageRoutes } from 'utils/config';
import Mirror from '../Mirror';
import { EllipsisVerticalIcon, TrashIcon } from '@heroicons/react/24/solid';
import { useContext, useState } from 'react';
import { useHidePublicationMutation } from 'graphql/generated/types';
import { WalletContext } from 'store/WalletContextProvider';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Modal from '../Modal';
import { Button } from '../atoms/Buttons';
import { toast } from 'react-hot-toast';

const ArtPreviewCard = ({ art }: any) => {
  const {
    currentProfileState: { currentProfile },
  }: any = useContext(WalletContext);

  const [openList, setOpenList] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openDeleteModal = async () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <DeleteModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} publication={art} />
      <div className="w-[91vw] sm:w-full  rounded-xl border relative">
        {currentProfile?.id === art?.profile?.id && (
          <div className="absolute top-1 right-2 flex justify-end cursor-pointer ">
            <EllipsisVerticalIcon
              className="z-10 w-8 h-8 hover:bg-gray-30 hover:rounded-full"
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
    </>
  );
};

export default ArtPreviewCard;

export const DeleteModal = ({ isModalOpen, setIsModalOpen, publication }: any) => {
  const [hidePost] = useHidePublicationMutation({
    onCompleted: () => {
      setIsModalOpen(false);
      console.log('Post has been deleted');
      window.location.reload();
    },
  });
  const deletePost = async () => {
    hidePost({
      variables: { request: { publicationId: publication?.id } },
    });
  };
  return (
    <Modal open={isModalOpen} setOpen={() => setIsModalOpen(false)}>
      <div>
        <div className="flex justify-between items-center border-b pb-2">
          <p className="heading-5 sm:heading-5">Delete Post</p>

          <XMarkIcon
            className="w-8 h-8 cursor-pointer rounded-full hover:bg-gray-200 p-1"
            onClick={() => setIsModalOpen(false)}
          />
        </div>
        <div className="mt-3 flex justify-between items-center sm:mt-5">
          <p className="paragraph-2 sm:paragraph-1">Are you Sure?</p>
          <Button name="Delete" variant="danger" onClick={deletePost} />
        </div>
      </div>
    </Modal>
  );
};
