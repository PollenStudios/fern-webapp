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
import OverlayLoader from '../OverlayLoader';

const EnableDispatcher = () => {
  const {
    currentProfileState: { currentProfile },
  }: any = useContext(WalletContext);
  const [loading, setLoading] = useState(false);

  const canUseRelay = currentProfile?.dispatcher?.canUseRelay;

  const onCompleted = () => {
    // toast.success('');
    // window.location.reload();
    console.log('completed');
  };

  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData();

  //   const {
  //     data: writeData,
  //     isLoading: writeLoading,
  //     write,
  //   } = useContractWrite({
  //     address: LENSHUB_PROXY,
  //     abi: LensHubProxy,
  //     functionName: 'setDispatcherWithSig',
  //     mode: 'recklesslyUnprepared',
  //     onSuccess: onCompleted,
  //     onError,
  //   });

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
              success: <b>Updated!</b>,
              error: <b>Could not update.</b>,
            });
            (await res) && window.location.reload();
          }
        } catch (error) {
          console.log(error);
        }
      },
      //   onError,
    },
  );

  const isLoading = signLoading || broadcastLoading || typedDataLoading;

  return (
    <div>
      {loading && <OverlayLoader />}
      <Button
        variant={canUseRelay ? 'danger' : 'outline'}
        // additionalClasses={'mr-auto'}
        disabled={isLoading}
        name={canUseRelay ? 'Disable dispatcher' : 'Enable dispatcher'}
        onClick={() => {
          setLoading(true);
          createSetProfileMetadataTypedData({
            variables: {
              request: {
                profileId: currentProfile?.id,
                enable: canUseRelay ? false : true,
              },
            },
          });

          setLoading(false);
        }}
      />
    </div>
  );
};

export default EnableDispatcher;
