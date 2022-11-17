import { useLazyQuery, useMutation } from '@apollo/client';
import axios from 'axios';
import { ethers } from 'ethers';
import React, { useContext, useState } from 'react';
import { WalletContext } from 'store/WalletContextProvider';
import {
  CreateSetProfileImageUriTypedDataDocument,
  HasTxHashBeenIndexedDocument,
  HasTxHashBeenIndexedRequest,
  ProfileDocument,
  Mutation,
} from 'graphql/generated/types';
import useBroadcast from 'hooks/useBroadcast';
import getIPFSLink from 'utils/getIPFSLink';
import getSignature from 'utils/getSignature';
import { Button } from 'app/components/atoms/Buttons';
import ProfileLogo from './assets/defaultLogo.png';
import Client from 'utils/apolloClient';
import { toast } from 'react-hot-toast';
import config from 'utils/config';
import { Loader } from '../atoms/Loader';
import { useSignTypedData } from 'wagmi';
import { pollUntilIndexed } from 'graphql/utils/hasTransactionIndexed';
import OverlayLoader from '../OverlayLoader';
import { apiRoutes } from 'API/apiRoutes';

function ProfileImage() {
  const {
    userSigNonceState: {
      userSigNonce: { userSignNonce },
    },
    currentProfileState: { currentProfile },
    dispatchCurrentProfile,
  }: any = useContext(WalletContext);

  const [getProfile] = useLazyQuery(ProfileDocument);
  const [loading, setLoading] = useState(false);
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData();

  const [image, setImage] = useState<any>();
  const [avatar, setAvatar] = useState<any>();
  const [imageLoading, setImageLoading] = useState<boolean>(false);

  const { broadcast, loading: broadcastLoading } = useBroadcast({
    onCompleted: data => {
      console.log('data_useBroadcast', data);
    },
  });

  const [createSetProfileImageURITypedData, { loading: typedDataLoading }] = useMutation<Mutation>(
    CreateSetProfileImageUriTypedDataDocument,
    {
      onCompleted: async ({ createSetProfileImageURITypedData }) => {
        try {
          const { id, typedData } = createSetProfileImageURITypedData;
          const signature = await signTypedDataAsync(getSignature(typedData));

          const broadcastResult = await broadcast({ request: { id, signature } });

          if (broadcastResult.data?.broadcast.__typename === 'RelayerResult') {
            const txId = broadcastResult.data?.broadcast?.txId!;
            // await pollUntilIndexed({ txId });
            const res = pollUntilIndexed({ txId });
            toast.promise(res, {
              loading: 'Indexing...',
              success: <b>Profile Updated!</b>,
              error: <b>Could not update.</b>,
            });
            await res;
            const profile = await getProfile({
              variables: {
                request: {
                  profileId: currentProfile.id,
                },
              },
            });
            dispatchCurrentProfile({ type: 'success', payload: profile.data?.profile });
          }
          if (broadcastResult.data?.broadcast.__typename !== 'RelayerResult') {
            console.error('create profile metadata via broadcast: failed', broadcastResult);
          } else console.log('create profile metadata via broadcast: broadcastResult', broadcastResult);
        } catch (error) {
          console.log(error);
        }
      },
      // onError
    },
  );

  const handleUpload = async (value: any) => {
    // value.preventDefault();
    // setUploading(true);
    setAvatar(value);
    setImageLoading(true);
    try {
      const formBodyData = new FormData();
      formBodyData.append('name', 'name');
      formBodyData.append('file', value);
      const { data } = await axios({
        method: 'post',
        url: config.baseUrl + apiRoutes.uploadMedia,
        headers: {
          Authorization: 'TOKEN ' + localStorage.getItem('backendToken'),
        },
        data: formBodyData,
      });
      if (data.file) {
        console.log('data.file', data.file);
        setImage(data.file);
        setImageLoading(false);
        toast.success('Successfully Uploaded');
      }
    } catch (error) {
      setImageLoading(false);
      console.log('error', error);
    }
  };

  const uploadImageToLens = async (image: string) => {
    const request = {
      profileId: currentProfile?.id,
      url: image,
    };
    setLoading(true);
    await createSetProfileImageURITypedData({
      variables: {
        options: { overrideSigNonce: userSignNonce },
        request,
      },
    });
    setLoading(false);
  };
  return (
    <div className="col-span-2 ">
      {loading && <OverlayLoader />}
      <div className="rounded-full  flex justify-center">
        <img
          className="rounded-full object-cover border  w-48 h-48"
          src={avatar ? URL.createObjectURL(avatar) : currentProfile?.picture?.original?.url ?? ProfileLogo}
          alt={currentProfile?.name}
        />
      </div>
      <div className="flex justify-center items-center flex-col gap-2 my-8">
        <input
          className=" border"
          type="file"
          accept=".png, .jpg, .jpeg, .gif"
          onChange={e => {
            e.target.files && handleUpload(e.target.files[0]);
          }}
        />
        {imageLoading && (
          <div className="pt-2 flex items-center gap-4">
            <p className="">Uploading</p>
            <Loader />
          </div>
        )}
      </div>
      <div className="flex justify-center">
        <Button
          type="button"
          disabled={imageLoading}
          additionalClasses={imageLoading ? 'cursor-not-allowed' : ''}
          variant="outline"
          name="Update Image"
          onClick={() => uploadImageToLens(image)}
        />
      </div>
    </div>
  );
}

export default ProfileImage;
