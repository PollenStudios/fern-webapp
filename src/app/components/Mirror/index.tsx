import { useMutation } from '@apollo/client';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/solid';
import { BroadcastDocument, CreateMirrorTypedDataDocument, Mutation } from 'graphql/generated/types';
import { pollUntilIndexed } from 'graphql/utils/hasTransactionIndexed';
import React, { useContext, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { WalletContext } from 'store/WalletContextProvider';
import { PageRoutes } from 'utils/config';
import getSignature from 'utils/getSignature';
import { useSignTypedData } from 'wagmi';

function Mirror({ publicationId, mirrorCounts }: any) {
  const navigate = useNavigate();
  const {
    userSigNonceState: {
      userSigNonce: { userSignNonce },
    },
    currentProfileState: { currentProfile },
  }: any = useContext(WalletContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [broadcast] = useMutation(BroadcastDocument);
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData();
  const [CreateMirrorTypedData] = useMutation<Mutation>(CreateMirrorTypedDataDocument);

  const CreateMirror = async () => {
    if (currentProfile?.dispatcher?.canUseRelay) {
      // createViaDispatcher(request);
    } else {
      const request = {
        profileId: currentProfile?.id,
        publicationId: publicationId,
        referenceModule: {
          followerOnlyReferenceModule: false,
        },
      };
      const result = await CreateMirrorTypedData({
        variables: {
          options: { overrideSigNonce: userSignNonce },
          request,
        },
      });

      const typedData = result.data?.createMirrorTypedData.typedData;

      const signatureTyped = getSignature(typedData);
      const signature = await signTypedDataAsync(signatureTyped);
      const broadcastResult = await broadcast({
        variables: {
          request: {
            id: result?.data?.createMirrorTypedData.id,
            signature: signature,
          },
        },
      });

      if (broadcastResult.data?.broadcast.__typename === 'RelayerResult') {
        const txId = broadcastResult.data?.broadcast?.txId!;
        const res = pollUntilIndexed({ txId });

        toast.promise(res, {
          loading: 'Indexing...',
          success: 'Post has been mirrored',
          error: 'Could not mirrored',
        });
        await res;
        navigate(PageRoutes.DISCOVERY);

        setIsLoading(false);
      }

      if (broadcastResult.data?.broadcast.__typename !== 'RelayerResult') {
        setIsLoading(false);
        console.error('create profile metadata via broadcast: failed', broadcastResult);
      } else console.log('create profile metadata via broadcast: broadcastResult', broadcastResult);
    }
  };

  return (
    <div className="flex justify-center items-center gap-1">
      <div
        onClick={CreateMirror}
        className="flex justify-center items-center  w-8 h-8 rounded-full hover:bg-gray-800 cursor-pointer space-x-1"
      >
        <ArrowsRightLeftIcon className="w-5  text-white" />
      </div>
      <div>{mirrorCounts}</div>
    </div>
  );
}

export default Mirror;
