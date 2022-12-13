import { useMutation } from '@apollo/client';
import { CreateSetDispatcherTypedDataDocument, Mutation } from 'graphql/generated/types';
import { pollUntilIndexed } from 'graphql/utils/hasTransactionIndexed';
import useBroadcast from 'hooks/useBroadcast';
import { useContext, useState } from 'react';
import { toast } from 'react-hot-toast';
import { WalletContext } from 'store/WalletContextProvider';
import getSignature from 'utils/getSignature';
import { useSignTypedData } from 'wagmi';
import { Button } from '../atoms/Buttons';
import { Loader } from '../atoms/Loader';
import OverlayLoader from '../OverlayLoader';

import { Switch } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

const EnableDispatcher = () => {
  const navigate = useNavigate();
  const {
    currentProfileState: { currentProfile },
  }: any = useContext(WalletContext);
  const [loading, setLoading] = useState(false);

  const canUseRelay = currentProfile?.dispatcher?.canUseRelay;

  const onCompleted = () => {
    console.log('completed');
  };

  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData();

  const { broadcast, data: broadcastData, loading: broadcastLoading } = useBroadcast({ onCompleted });
  const [createSetProfileMetadataTypedData, { loading: typedDataLoading }] = useMutation<Mutation>(
    CreateSetDispatcherTypedDataDocument,
    {
      onCompleted: async ({ createSetDispatcherTypedData }) => {
        try {
          const { id, typedData } = createSetDispatcherTypedData;
          const signature = await signTypedDataAsync(getSignature(typedData));

          const {
            data: { broadcast: result },
          } = await broadcast({ request: { id, signature } });
          if (result) {
            const res = pollUntilIndexed({ txHash: result.txHash }, setLoading, navigate);
            toast.promise(res, {
              loading: 'Indexing...',
              success: 'Dispatcher is updated',
              error: 'Could not update.',
            });

            (await res) && window.location.reload();
          }
        } catch (error: any) {
          toast.error(error.message);
          console.log(error);
        } finally {
          setLoading(false);
        }
      },
      //   onError,
    },
  );

  const enableDispatcher = async () => {
    setLoading(true);
    await createSetProfileMetadataTypedData({
      variables: {
        request: {
          profileId: currentProfile?.id,
          enable: canUseRelay ? false : true,
        },
      },
    });
  };

  const isLoading = signLoading || broadcastLoading || typedDataLoading;

  return (
    <div>
      {loading && <OverlayLoader />}
      {loading ? (
        <div className="border-gray-40 w-[60px] py-2 sm:py-1 border text-base font-medium rounded-full shadow-sm text-white focus:outline-none">
          <Loader />
        </div>
      ) : (
        <>
          <Switch
            checked={canUseRelay}
            disabled={isLoading}
            className={classNames(
              canUseRelay ? 'bg-gray-700' : 'bg-gray-300',
              'relative inline-flex h-6 w-11 ml-3 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2',
            )}
            onClick={enableDispatcher}
          >
            <span
              aria-hidden="true"
              className={classNames(
                canUseRelay ? 'translate-x-5' : 'translate-x-0',
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
              )}
            />
          </Switch>
        </>
      )}
    </div>
  );
};

export default EnableDispatcher;
