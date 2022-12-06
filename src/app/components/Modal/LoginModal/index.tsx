import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from 'app/components/atoms/Buttons';
import { LoginModalProps } from 'app/components/atoms/FormElements/types';
import { Loader } from 'app/components/atoms/Loader';
import { useContext, useEffect, useState } from 'react';
import { WalletContext } from 'store/WalletContextProvider';
import Modal from '..';

export const LoginModal = ({ openModal, setIsLoading }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(openModal);
  const [modalButtonLoading, setModalButtonLoading] = useState(false);
  const [modalData, setModalData] = useState<LoginModalProps>();

  const { connectToBrowserWallets }: any = useContext(WalletContext);

  const connectWallet = async () => {
    if (modalData && modalData.websiteUrl) {
      window.open(modalData.websiteUrl, '_blank');
    }
    setModalButtonLoading(true);
    await connectToBrowserWallets(infoModal, closeModal);
    setModalButtonLoading(false);
  };

  useEffect(() => {
    setIsModalOpen(openModal);
  }, [openModal]);

  const closeModal = () => {
    setIsLoading(false);
    setModalButtonLoading(false);
  };

  const infoModal = (args: LoginModalProps) => setModalData(args);

  return (
    <Modal open={isModalOpen} setOpen={closeModal}>
      <>
        <div>
          <div className="flex justify-between items-center border-b pb-2">
            <p className="heading-5 sm:heading-5">Login</p>

            <XMarkIcon className="w-8 h-8 cursor-pointer rounded-full hover:bg-gray-200 p-1" onClick={closeModal} />
          </div>
          <div className="mt-3 text-left sm:mt-5">
            <p className="paragraph-2 sm:paragraph-1">{modalData ? modalData.heading : 'Login into Metamask'}</p>
          </div>
        </div>
        <div className="mt-5 sm:mt-9 w-full flex justify-end gap-2 ">
          {/* {modalData && modalData.websiteUrl && (
            <a href={modalData.websiteUrl} target="_blank" rel="noreferrer">
              Go to website
            </a>
          )} */}
          {modalData && modalData?.secondaryButtonText && (
            <Button
              type="button"
              name={modalData?.secondaryButtonText || 'Cancel'}
              variant="outline"
              additionalClasses="text-red-800 border-red-800"
              onClick={closeModal}
            />
          )}

          <>
            {modalButtonLoading ? (
              <div className="bg-primary  min-w-[115px] py-2.5  border text-base font-medium rounded-full shadow-sm text-white focus:outline-none">
                <Loader />
              </div>
            ) : (
              <Button
                type="button"
                onClick={connectWallet}
                name={modalData ? modalData?.primaryButtonText : 'Login'}
                variant="primary"
              />
            )}
          </>
        </div>
      </>
    </Modal>
  );
};
