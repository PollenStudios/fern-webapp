import { useMutation } from '@apollo/client';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { WalletContext } from 'store/WalletContextProvider';
import {
  CreateProfileDocument,
  CreateSetProfileImageUriTypedDataDocument,
  Mutation,
  ProfilesDocument,
} from 'graphql/generated/types';
import { Button } from 'app/components/atoms/Buttons';
import { Input } from 'app/components/atoms/FormElements';
import ImageUploader, { ImagePreviewer } from 'app/components/atoms/UploadFiles';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import generateNonce, { createUser } from 'utils/generateNonce';
import Client from 'utils/apolloClient';
import getSignature from 'utils/getSignature';
import { ethers } from 'ethers';
import useBroadcast from 'hooks/useBroadcast';
import { pollUntilIndexed } from 'graphql/utils/hasTransactionIndexed';

import OverlayLoader from 'app/components/OverlayLoader';
import config, { PageRoutes } from 'utils/config';
import { useSignTypedData } from 'wagmi';

const NewProfile = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [avatar, setAvatar] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isHandleExist, setIsHandleExist] = useState(false);
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData();

  const {
    accountState: { account },
    isLoggedInState: { isLoggedin },
    currentProfileState: { currentProfile },
    dispatchCurrentProfile,
    dispatchIsLoggedIn,
  }: any = useContext(WalletContext);
  const navigate = useNavigate();

  // const [] = useMutation();
  // const [getProfile] = useLazyQuery(ProfileDocument);
  const getAllProfiles = async (request: any) => {
    const result = await Client.query({
      query: ProfilesDocument,
      variables: {
        request,
      },
      fetchPolicy: 'network-only',
    });

    return result.data.profiles;
  };
  const { broadcast, loading: broadcastLoading } = useBroadcast({
    onCompleted: data => {
      console.log('data_useBroadcast', data);
    },
  });
  const createProfile = async (request: any) => {
    const result = await Client.mutate({
      mutation: CreateProfileDocument,
      variables: {
        request,
      },
    });
    return result.data!.createProfile;
  };

  const [createSetProfileImageURITypedData] = useMutation<Mutation>(CreateSetProfileImageUriTypedDataDocument, {
    // onCompleted: async ({ createSetProfileImageURITypedData }) => {
    //   try {
    //     console.log('createSetProfileImageURITypedData', createSetProfileImageURITypedData);
    //     const { id, typedData } = createSetProfileImageURITypedData;
    //     // const signatureTyped = getSignature(typedData);
    //     // const provider = new ethers.providers.Web3Provider(window.ethereum);
    //     // const signer = provider.getSigner();
    //     const signature = await signTypedDataAsync(getSignature(typedData));
    //     // const signature = await signer._signTypedData(
    //     //   signatureTyped.domain,
    //     //   signatureTyped.types,
    //     //   signatureTyped.value,
    //     // );
    //     const broadcastResult = await broadcast({ request: { id, signature } });
    //     if (broadcastResult.data?.broadcast.__typename === 'RelayerResult') {
    //       const txId = broadcastResult.data?.broadcast?.txId!;
    //       const txHash = broadcastResult.data?.broadcast?.txHash!;
    //       const indexingResult = await pollUntilIndexed({ txHash: broadcastResult.txHash });
    //       console.log('indexerResult ', indexingResult);
    //       const profiles = await getAllProfiles({
    //         profileId: currentProfile.id,
    //       });
    //       dispatchCurrentProfile({ type: 'success', payload: profiles.items[0] });
    //     }
    //     if (broadcastResult.data?.broadcast.__typename !== 'RelayerResult') {
    //       console.error('create profile metadata via broadcast: failed', broadcastResult);
    //     } else console.log('create profile metadata via broadcast: broadcastResult', broadcastResult);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },
    // onError
  });

  const uploadImageToLens = async (image: string, id: string) => {
    try {
      const request = {
        profileId: id,
        url: image,
      };
      const { data } = await createSetProfileImageURITypedData({
        variables: {
          // options: { overrideSigNonce: userSignNonce },
          request,
        },
      });
      console.log('data', data);
      return {
        id: data?.createSetProfileImageURITypedData?.id,
        typedData: data?.createSetProfileImageURITypedData?.typedData,
      };
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
      return error;
    }
  };
  const errorMessageClassName = 'paragraph-3 mt-1 text-red-600';

  const onSubmit = async (formData: any) => {
    try {
      setIsLoading(true);
      const request = {
        handle: formData.handle,
        profilePictureUri: '',
      };
      const createProfileResult = await createProfile(request);
      if (createProfileResult?.__typename === 'RelayError') {
        // toast.error('Handle  already taken try something else');
        setIsHandleExist(true);
        setIsLoading(false);
        return 0;
      } else if (createProfileResult?.__typename === 'RelayerResult') {
        console.log('createProfileResult', createProfileResult);
        const indexingResult = pollUntilIndexed({ txHash: createProfileResult.txHash });
        toast.promise(indexingResult, {
          loading: 'Creating...',
          success: <b>Profile Created!</b>,
          error: <b>Could not create.</b>,
        });
        console.log('indexingResult', await indexingResult);

        const allProfiles = await getAllProfiles({ ownedBy: account });
        console.log('allProfiles', allProfiles);
        const firstProfile = allProfiles.items[0];
        const formBodyData = new FormData();
        formBodyData.append('username', firstProfile.handle);
        formBodyData.append('wallet_address', account);
        formBodyData.append('lens_profile', firstProfile.id);
        formBodyData.append('profile_pic', avatar ?? '');
        const createUserResult: any = await createUser(formBodyData);

        toast.success('User profile created');
        // const createUserResult = await createUser(formData.handle, account, allProfiles.items[0].id);
        console.log('createUserResult', createUserResult);
        console.log('User profile created Metadata not saved ', createProfileResult);
        const generateNonceResult = await generateNonce(firstProfile.handle, account, firstProfile.id);
        console.log('generateNonceResult', generateNonceResult);
        const { id, typedData } = await uploadImageToLens(createUserResult.data.profile_pic, firstProfile.id);
        const signature = await signTypedDataAsync(getSignature(typedData));
        const broadcastResult = await broadcast({ request: { id, signature } });
        // console.log('broadcastResult', broadcastResult);
        if (broadcastResult.data?.broadcast.__typename === 'RelayerResult') {
          const indexingResult = pollUntilIndexed({ txHash: broadcastResult?.data?.broadcast?.txHash });
          toast.promise(indexingResult, {
            loading: 'Creating...',
            success: <b>Profile Created!</b>,
            error: <b>Could not create.</b>,
          });
          console.log('indexerResult ', await indexingResult);
          const profiles = await getAllProfiles({
            // profileId: currentProfile.id,
            ownedBy: account,
          });
          dispatchCurrentProfile({ type: 'success', payload: profiles.items[0] });
        }
        if (broadcastResult.data?.broadcast.__typename !== 'RelayerResult') {
          console.error('create profile metadata via broadcast: failed', broadcastResult);
        } else console.log('create profile metadata via broadcast: broadcastResult', broadcastResult);

        dispatchIsLoggedIn({ type: 'success', payload: true });

        dispatchCurrentProfile({ type: 'success', payload: allProfiles.items[0] });

        setIsLoading(false);
        navigate(PageRoutes.DISCOVERY);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
      setIsLoading(false);
      dispatchIsLoggedIn({ type: 'error', payload: error });
      navigate(PageRoutes.ERROR_PAGE);
    }
  };
  // useEffect(() => {
  //   if (currentProfile?.handle) {
  //     navigate(PageRoutes.SETTINGS);
  //   }
  // }, [currentProfile]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      encType="multipart/form-data"
      className="flex flex-col gap-4 my-28 h-[69.5vh]  justify-center w-full md:w-[50vw] xl:w-[40vw] main-container"
    >
      {isLoading && <OverlayLoader />}
      <p className="heading-5 pb-2 border-b border-primary">Create new profile</p>
      <div className="flex flex-col gap-6 ">
        {/* <div className=" flex justify-center">
          <ImageUploader
            parentDivClassName=" w-60 h-60 hover:bg-gray-400"
            imageClassName="object-cover"
            maximumFiles={1}
            images={avatar}
            setImages={setAvatar}
          />
        </div> */}
        <div className="flex flex-col gap-4">
          <label htmlFor={'image'} className="heading-6  mt-5">
            Profile image *
          </label>
          <div className="flex flex-col gap-4">
            <ImagePreviewer profileImage imagePreview={avatar && URL.createObjectURL(avatar)} />

            <input
              name="image"
              className=""
              type="file"
              accept=".png, .jpg, .jpeg, .gif"
              onChange={e => {
                e.target.files && setAvatar(e.target.files[0]);
              }}
            />
          </div>
        </div>
        <div>
          <Input
            type="text"
            name="handle"
            label="User handle *"
            placeholder="Enter your handle"
            register={register}
            onChange={() => {
              setIsHandleExist(false);
            }}
            required
            pattern={/^[a-z0-9_]{5,30}$/}
          />
          {errors.handle && errors.handle.type === 'pattern' && (
            <p className={errorMessageClassName}>Check handle format</p>
          )}
          {isHandleExist && <p className={errorMessageClassName}>Handle already taken try something else</p>}
        </div>
      </div>
      <div className="mt-10">
        <Button
          variant="primary"
          disabled={isLoading}
          additionalClasses={isLoading ? 'cursor-not-allowed' : ''}
          name={isLoading ? 'Creating...' : 'Create'}
          type="submit"
        />
      </div>
    </form>
  );
};

export default NewProfile;
