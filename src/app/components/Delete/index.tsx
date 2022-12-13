import { Button } from '../atoms/Buttons';
import Modal from '../Modal';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useHidePublicationMutation } from 'graphql/generated/types';
import { toast } from 'react-hot-toast';
import { useParams, useLocation } from 'react-router-dom';
import { PageRoutes } from 'utils/config';

export const DeleteModal = ({ isModalOpen, setIsModalOpen, publication }: any) => {
  const { id: publicationId } = useParams();
  const location = useLocation();
  console.log(location.pathname === `/art/${publicationId}` ? 'kfh' : 'nahi');
  const [hidePost] = useHidePublicationMutation({
    onCompleted: () => {
      setIsModalOpen(false);
      setTimeout(() => {
        location.pathname === `/art/${publicationId}`
          ? window.location.replace(PageRoutes.HOMEPAGE)
          : window.location.reload();
      }, 1500);
      toast.success('Post has been deleted');
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
