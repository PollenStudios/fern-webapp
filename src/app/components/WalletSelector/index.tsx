import { useContext, useEffect } from 'react';
import config from 'utils/config';
import { useAccount, useConnect, useNetwork } from 'wagmi';
import SwitchNetwork from '../SwitchNetwork';
import { Button } from '../atoms/Buttons';
import { WalletContext } from 'store/WalletContextProvider';
import Modal from '../Modal';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface Props {
  openModal: boolean;
  setIsLoading: (openModal: boolean) => void;
}

const WalletConnector = ({ openModal, setIsLoading: setOpenModalLoading }: Props) => {
  const { connector: activeConnector, isConnected, address } = useAccount();
  const {
    connect,
    connectors,
    isLoading: walletConnectLoading,
  } = useConnect({
    onError(error) {
      toast.error(error.message);
    },
  });
  const { chain } = useNetwork();

  const {
    handleSign,
    dispatchAccount,
    accountState: { account },
    isLoading,
    setIsLoading,
  }: any = useContext(WalletContext);

  const closeModal = () => {
    setOpenModalLoading(false);
    setIsLoading(false);
  };

  useEffect(() => {
    dispatchAccount({ type: 'success', payload: address?.toLowerCase() });
  }, [address, dispatchAccount]);

  return (
    <Modal open={openModal} setOpen={setOpenModalLoading}>
      <div>
        <div className="flex justify-between items-center border-b pb-2">
          <p className="heading-5 sm:heading-5">Login</p>
          <XMarkIcon
            className="w-8 h-8 cursor-pointer rounded-full hover:bg-gray-200 p-1"
            onClick={() => setOpenModalLoading(false)}
          />
        </div>
        {activeConnector?.id ? (
          chain?.id === config.chainId ? (
            <>
              <div className="my-3 text-left sm:mt-5">
                <p className="paragraph-2 sm:paragraph-1">Sign In with F3RN</p>
              </div>
              {isConnected && (
                <div className="w-full flex justify-end">
                  <Button name={isLoading ? 'Loading...' : 'Sign-In'} onClick={() => handleSign(account, closeModal)} />
                </div>
              )}
            </>
          ) : (
            <>
              <div className="my-3 text-left sm:mt-5">
                <p className="paragraph-2 sm:paragraph-1">Switch your Network</p>
              </div>
              <div className="w-full flex justify-end">
                <SwitchNetwork />
              </div>
            </>
          )
        ) : (
          <>
            <div className="my-3 text-left sm:mt-5">
              <p className="paragraph-2 sm:paragraph-1">Connect your wallet.</p>
            </div>
            {connectors.map(
              connector =>
                connector.id === 'injected' && (
                  <div className="w-full flex justify-end items-center" key={connector.id}>
                    <Button
                      // disabled={!connector.ready}
                      key={connector.id}
                      onClick={() =>
                        !connector.ready
                          ? window.open('https://metamask.io/download/', '_blank')
                          : connect({ connector })
                      }
                      name={
                        walletConnectLoading
                          ? 'Loading...'
                          : `${!connector.ready ? ' Install Metamask' : 'Browser Wallet'}`
                      }
                    />
                  </div>
                ),
            )}
          </>
        )}
      </div>
    </Modal>
  );
};

export default WalletConnector;
