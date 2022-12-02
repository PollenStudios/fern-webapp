import { useMutation } from '@apollo/client';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { WalletContext } from 'store/WalletContextProvider';
import {
  CreateProfileDocument,
  CreateSetProfileImageUriTypedDataDocument,
  Mutation,
  ProfilesDocument,
} from 'graphql/generated/types';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import generateNonce, { createUser } from 'utils/generateNonce';
import Client from 'utils/apolloClient';
import getSignature from 'utils/getSignature';
import useBroadcast from 'hooks/useBroadcast';
import { pollUntilIndexed } from 'graphql/utils/hasTransactionIndexed';

import { PageRoutes } from 'utils/config';
import { useSignTypedData } from 'wagmi';
import { backendToken } from 'utils/getBackendToken';
import NewLensProfile from './newLensProfile';

const NewProfile = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [avatar, setAvatar] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isHandleExist, setIsHandleExist] = useState<boolean>(false);
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData();

  const {
    accountState: { account },
    dispatchCurrentProfile,
    dispatchIsLoggedIn,
  }: any = useContext(WalletContext);
  const navigate = useNavigate();

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

  const [createSetProfileImageURITypedData] = useMutation<Mutation>(CreateSetProfileImageUriTypedDataDocument);

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

  const createNewLensProfile = async (formData: { [key: string]: string }) => {
    try {
      setIsLoading(true);
      const request = {
        handle: formData.handle,
        profilePictureUri: '',
      };
      const createProfileResult = await createProfile(request);
      if (createProfileResult?.__typename === 'RelayError') {
        setIsHandleExist(true);
        setIsLoading(false);
        return 0;
      } else if (createProfileResult?.__typename === 'RelayerResult') {
        const indexingResult = pollUntilIndexed({ txHash: createProfileResult.txHash });
        toast.promise(indexingResult, {
          loading: 'Creating...',
          success: 'Profile Created',
          error: 'Could not create.',
        });
        console.log('indexingResult', await indexingResult);

        const allProfiles = await getAllProfiles({ ownedBy: account });
        const firstProfile = allProfiles.items[0];

        const formBodyData = new FormData();
        formBodyData.append('username', firstProfile.handle);
        formBodyData.append('wallet_address', account);
        formBodyData.append('lens_profile', firstProfile.id);
        formBodyData.append('profile_pic', avatar ?? '');

        const createUserResult: any = await createUser(formBodyData);
        toast.success('User profile created');
        const generateNonceResult = await generateNonce(firstProfile.handle, account, firstProfile.id);
        if (generateNonceResult.token) {
          try {
            const { id, typedData } = await uploadImageToLens(createUserResult.data.profile_pic, firstProfile.id);
            const signature = await signTypedDataAsync(getSignature(typedData));
            const broadcastResult = await broadcast({ request: { id, signature } });

            if (broadcastResult.data?.broadcast.__typename === 'RelayerResult') {
              const indexingResult = pollUntilIndexed({ txHash: broadcastResult?.data?.broadcast?.txHash });
              toast.promise(indexingResult, {
                loading: 'Uploading profile image',
                success: 'Profile Image Uploaded',
                error: 'Could not uploaded',
              });
              console.log('indexerResult ', await indexingResult);

              const profiles = await getAllProfiles({
                ownedBy: account,
              });
              dispatchCurrentProfile({ type: 'success', payload: profiles.items[0] });
            }
            if (broadcastResult.data?.broadcast.__typename !== 'RelayerResult') {
              console.error('create profile metadata via broadcast: failed', broadcastResult);
            } else console.log('create profile metadata via broadcast: broadcastResult', broadcastResult);

            dispatchIsLoggedIn({ type: 'success', payload: true });
            dispatchCurrentProfile({ type: 'success', payload: allProfiles.items[0] });
          } catch (error: any) {
            console.log('error', error.message);
            toast.success('Refresh the page for login');
            // toast.error(error.message);
          } finally {
            navigate(PageRoutes.DISCOVERY);
          }
        }
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
      dispatchIsLoggedIn({ type: 'error', payload: error });
      navigate(PageRoutes.ERROR_PAGE);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (backendToken()) {
      navigate(PageRoutes.DISCOVERY);
    }
  }, [backendToken()]);

  return (
    <NewLensProfile
      avatar={avatar}
      handleSubmit={handleSubmit}
      register={register}
      onSubmit={createNewLensProfile}
      isLoading={isLoading}
      setAvatar={setAvatar}
      isHandleExist={isHandleExist}
      errors={errors}
      setIsHandleExist={setIsHandleExist}
    />
  );
};

export default NewProfile;
