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

const EnableDispatcher = () => {
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
            const res = pollUntilIndexed({ txHash: result.txHash });
            toast.promise(res, {
              loading: 'Indexing...',
              success: 'Updated',
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
        <div className="border-gray-40 w-[180px] py-2 sm:py-3 border text-base font-medium rounded-full shadow-sm text-white focus:outline-none">
          <Loader />
        </div>
      ) : (
        <Button
          variant={canUseRelay ? 'danger' : 'outline'}
          name={canUseRelay ? 'Disable dispatcher' : 'Enable dispatcher'}
          onClick={enableDispatcher}
        />
      )}
    </div>
  );
};

export default EnableDispatcher;
