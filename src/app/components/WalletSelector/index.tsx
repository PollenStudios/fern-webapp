import { useContext } from 'react';
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

const WalletConnector = ({ openModal, setIsLoading }: Props) => {
  const { connector: activeConnector, isConnected, address } = useAccount();
  const { connect, connectors, isLoading } = useConnect({
    onError(error) {
      toast.error(error.message);
    },
  });
  const { chain } = useNetwork();

  const { handleSign }: any = useContext(WalletContext);

  const closeModal = () => {
    setIsLoading(false);
  };

  return (
    <Modal open={openModal} setOpen={setIsLoading}>
      <div>
        <div className="flex justify-between items-center border-b pb-2">
          <p className="heading-5 sm:heading-5">Login</p>
          <XMarkIcon
            className="w-8 h-8 cursor-pointer rounded-full hover:bg-gray-200 p-1"
            onClick={() => setIsLoading(false)}
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
                  <Button name="Sign-In" onClick={() => handleSign(address?.toLowerCase(), closeModal)} />
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
                      disabled={!connector.ready}
                      key={connector.id}
                      onClick={() => connect({ connector })}
                      name={isLoading ? 'Loading...' : `Browser Wallet ${!connector.ready ? ' (Not installed)' : ''}`}
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
