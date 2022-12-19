import { useMutation } from '@apollo/client';
import { useContext, useState } from 'react';
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
// import { useSignTypedData } from 'wagmi';
import NewLensProfile from './newLensProfile';
import { handleSignTypeData } from 'graphql/utils/signMessage';

const NewProfile = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [avatar, setAvatar] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isHandleExist, setIsHandleExist] = useState<boolean>(false);
  // const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData();

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
          success: 'User profile created and just wait for profile image to upload',
          error: 'Could not create.',
        });
        await indexingResult;

        const allProfiles = await getAllProfiles({ ownedBy: account });
        const firstProfile = allProfiles.items[0];

        const formBodyData = new FormData();
        formBodyData.append('username', firstProfile.handle);
        formBodyData.append('wallet_address', account);
        formBodyData.append('lens_profile', firstProfile.id);
        formBodyData.append('profile_pic', avatar ?? '');

        const createUserResult: any = await createUser(formBodyData);
        const generateNonceResult = await generateNonce(firstProfile.handle, account, firstProfile.id);
        if (generateNonceResult.token) {
          try {
            const { id, typedData } = await uploadImageToLens(createUserResult.data.profile_pic, firstProfile.id);
            //Getting signature from wagmi,but not working
            // const signature = await signTypedDataAsync(getSignature(typedData));
            const signature = await handleSignTypeData(getSignature(typedData));
            const broadcastResult = await broadcast({ request: { id, signature } });

            if (broadcastResult.data?.broadcast.__typename === 'RelayerResult') {
              const indexingResult = pollUntilIndexed(
                { txHash: broadcastResult?.data?.broadcast?.txHash },
                setIsLoading,
                navigate,
              );
              toast.promise(indexingResult, {
                loading: 'Uploading profile image',
                success: 'Profile image uploaded',
                error: 'Could not uploaded',
              });
              await indexingResult;

              const profiles = await getAllProfiles({
                ownedBy: account,
              });
              dispatchCurrentProfile({ type: 'success', payload: profiles.items[0] });
            } else {
              console.error('create profile metadata via broadcast: failed', broadcastResult);
            }
          } catch (error: any) {
            dispatchCurrentProfile({ type: 'success', payload: allProfiles.items[0] });
            toast.error('Profile image is not uploaded');
          } finally {
            dispatchIsLoggedIn({ type: 'success', payload: true });
            navigate(PageRoutes.DISCOVERY);
          }
        }
      }
    } catch (error: any) {
      toast.error(error.message);
      dispatchIsLoggedIn({ type: 'error', payload: error });
      navigate(PageRoutes.ERROR_PAGE);
    } finally {
      setIsLoading(false);
    }
  };

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
