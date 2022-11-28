import { useLazyQuery, useMutation } from '@apollo/client';
import { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Input, TextArea } from 'app/components/atoms/FormElements';
import { WalletContext } from 'store/WalletContextProvider';
import {
  BroadcastDocument,
  CreatePublicSetProfileMetadataUriRequest,
  CreateSetProfileMetadataTypedDataDocument,
  CreateSetProfileMetadataViaDispatcherDocument,
  ProfileDocument,
} from 'graphql/generated/types';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import getSignature from 'utils/getSignature';
import { Button } from 'app/components/atoms/Buttons';
import ProfileImage from 'app/components/ProfileImage';
import { useSignTypedData } from 'wagmi';
import config, { PageRoutes } from 'utils/config';
import EnableDispatcher from 'app/components/Dispatcher/EnableDispatcher';
import storeFiles from 'utils/web3Storage';
import { pollUntilIndexed } from 'graphql/utils/hasTransactionIndexed';
import { getBackendProfile } from 'utils/generateNonce';
import OverlayLoader from 'app/components/OverlayLoader';
import { isEmpty } from 'utils/utility';
import { EMAIL_REGEX, NAME_REGEX, URL_REGEX } from 'utils/constant';
import { Helmet, HelmetProvider } from 'react-helmet-async';

// const artistStatus = (status: string) => {
//   switch (status) {
//     case 'approved':x
//       return '';
//     case 'pending':
//       return '';
//     case 'rejected':
//       return '';
//     default:
//       return '';
//   }
// };

const Settings = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty }, //isDirty gives boolean value ->if input field value is changed by user then isDirty will automatically becomes true otherwise it will be false.
    setValue,
  } = useForm({
    mode: 'onBlur',
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    accountState: { account },
    currentProfileState: { currentProfile, loading: userProfileDataLoader },
    dispatchCurrentProfile,
  }: any = useContext(WalletContext);
  const [broadcast] = useMutation(BroadcastDocument);
  const [getProfile] = useLazyQuery(ProfileDocument);

  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData();

  const [createSetProfileMetadataTypedData] = useMutation(CreateSetProfileMetadataTypedDataDocument);

  const updateProfile = async (request: CreatePublicSetProfileMetadataUriRequest) => {
    dispatchCurrentProfile({ loading: true, currentProfile: {} });
    try {
      const result = await createSetProfileMetadataTypedData({
        variables: {
          request,
        },
      });

      const typedData = result.data?.createSetProfileMetadataTypedData.typedData;

      const signatureTyped = getSignature(typedData);
      const signature = await signTypedDataAsync(signatureTyped);
      const broadcastResult = await broadcast({
        variables: {
          request: {
            id: result?.data?.createSetProfileMetadataTypedData.id,
            signature: signature,
          },
        },
      });

      if (broadcastResult.data?.broadcast.__typename === 'RelayerResult') {
        const txId = broadcastResult.data?.broadcast?.txId!;

        const indexerResult = pollUntilIndexed({ txId });

        toast.promise(indexerResult, {
          loading: 'Indexing...',
          success: 'Please refresh the page now, to see updated data',
          // success: 'Profile updated',
          error: 'Could not update',
        });

        const indexedResult = await indexerResult;
        // if (indexedResult) {
        const getProfileResult = await getBackendProfile();

        const profile = await getProfile({
          variables: {
            request: {
              profileId: currentProfile.id,
            },
          },
        });

        dispatchCurrentProfile({
          type: 'success',
          payload: { ...profile.data?.profile, artistApprovalStatus: getProfileResult?.artist_approval_status },
        });
        // setIsLoading(false);
        // window.location.reload();
        // }
      }

      if (broadcastResult.data?.broadcast.__typename !== 'RelayerResult') {
        console.error('create profile metadata via broadcast: failed', broadcastResult);
      } else console.log('create profile metadata via broadcast: broadcastResult', broadcastResult);
      setIsLoading(false);
      // window.location.reload();
    } catch ({ message }) {
      toast.error(`${message}`);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentProfile && Object.keys(currentProfile).length !== 0) {
      setValue('firstName', currentProfile.name);
      setValue('userName', currentProfile.handle);
      setValue('bio', currentProfile.bio);
      setValue(
        'website',
        currentProfile?.attributes?.filter((attribute: any) => attribute?.key === 'website')[0]?.value,
      );
      setValue(
        'twitter',
        currentProfile?.attributes?.filter((attribute: any) => attribute?.key === 'twitter')[0]?.value,
      );
      setValue('email', currentProfile?.attributes?.filter((attribute: any) => attribute?.key === 'email')[0]?.value);
      setValue(
        'instagram',
        currentProfile?.attributes?.filter((attribute: any) => attribute?.key === 'instagram')[0]?.value,
      );
    }
  }, [currentProfile, account]);

  const [updateProfileViaDispatcher] = useMutation(CreateSetProfileMetadataViaDispatcherDocument, {
    onCompleted: data => {
      if (data.createSetProfileMetadataViaDispatcher.__typename === 'RelayerResult') {
        console.log('txId', { txId: data.createSetProfileMetadataViaDispatcher });
        setIsLoading(false);
        // window.location.reload();
      }
    },
  });

  const updateViaDispatcher = async (request: CreatePublicSetProfileMetadataUriRequest) => {
    const { data } = await updateProfileViaDispatcher({
      variables: { request },
    });
    if (data?.createSetProfileMetadataViaDispatcher?.__typename === 'RelayError') {
      updateProfile(request);
    }
  };

  const getUrlValue = (value: string | undefined) => {
    return value?.includes('http://') || value?.includes('https://') ? value?.split('//')[1] : value;
  };

  const updateUserProfileData = async (formData: any) => {
    try {
      setIsLoading(true);
      const dataObject = {
        name: formData.firstName,
        bio: formData.bio,
        cover_picture: null,
        attributes: [
          {
            key: 'website',
            value: getUrlValue(formData.website),
            traitType: 'string',
          },
          {
            key: 'twitter',
            value: getUrlValue(formData.twitter),
            traitType: 'string',
          },
          {
            key: 'email',
            value: formData.email,
            traitType: 'string',
          },
          {
            key: 'instagram',
            value: getUrlValue(formData.instagram),
            traitType: 'string',
          },
        ],
        version: '1.0.0',
        metadata_id: uuidv4(),
        createdOn: new Date(),
        appId: config.appNameForLensApi,
      };
      // toast.success('Submitting Profile');

      const uploadToWeb3result = await storeFiles(dataObject);
      const createProfileMetadataRequest = {
        profileId: currentProfile?.id,
        metadata: `https://${uploadToWeb3result}.ipfs.w3s.link/hello.json`,
      };

      if (currentProfile?.dispatcher?.canUseRelay) {
        updateViaDispatcher(createProfileMetadataRequest);
      } else {
        updateProfile(createProfileMetadataRequest);
      }
    } catch (error: any) {
      setIsLoading(false);
      console.log(error);
      toast.error('Something went wrong');
    }
  };
  const SignUpForArtist = () => {
    const name = currentProfile?.name;
    const email = currentProfile?.attributes?.filter((attribute: any) => attribute?.key === 'email')[0]?.value;
    // const website = currentProfile?.attributes?.filter((attribute: any) => attribute?.key === 'website')[0]?.value;
    const instagram = currentProfile?.attributes?.filter((attribute: any) => attribute?.key === 'instagram')[0]?.value;
    if (isEmpty(name)) {
      toast.error('Please update your name');
    } else if (isEmpty(email)) {
      toast.error('Please update your email');
    } else if (isEmpty(instagram)) {
      toast.error('Please update your instagram url');
    } else navigate(PageRoutes.SIGN_UP_ARTIST);
  };
  const checkRequestStatus = async () => {
    try {
      const getProfileResult = await getBackendProfile();

      const profile = await getProfile({
        variables: {
          request: {
            profileId: currentProfile.id,
          },
        },
      });
      if (getProfileResult?.artist_approval_status === 'approved')
        toast.success('Congratulations, Your Request has been Approved.');
      if (getProfileResult?.artist_approval_status === 'pending')
        toast("Your request hasn't been approved yet.", {
          icon: '⏲',
        });
      dispatchCurrentProfile({
        type: 'success',
        payload: { ...profile.data?.profile, artistApprovalStatus: getProfileResult?.artist_approval_status },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const errorMessageClassName = 'paragraph-3 mt-1 text-red-600';

  if (userProfileDataLoader) {
    return <OverlayLoader />;
  }

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Settings - F3rn | Fine Art Discovery and Curation</title>
        </Helmet>
      </HelmetProvider>
      <div className="main-container mb-10 mt-24">
        {isLoading && <OverlayLoader />}
        <p className="heading-4 mb-6 md:mb-2">Settings</p>
        <div className="flex justify-between">
          <p className="heading-5 border-b-4 pb-2 border-primary flex items-end">Edit Profile</p>

          <div className="mb-2 sm:mb-4 flex justify-end items-end">
            {currentProfile?.artistApprovalStatus === null ? (
              <Button onClick={SignUpForArtist} variant="outline" name="Sign up for Artist" type="button" />
            ) : (
              currentProfile?.artistApprovalStatus === 'pending' && (
                <Button onClick={checkRequestStatus} variant="outline" name="Check Request Status" type="button" />
              )
            )}
          </div>
        </div>
        <div className="flex flex-col md:grid md:grid-cols-6 pt-10 border-t border-primary">
          <div className="col-span-2">
            {/* profile Image Component */}
            <ProfileImage />

            <div className="flex justify-center flex-col">
              <p className="heading-5 text-center py-5">
                {currentProfile?.ownedBy
                  ? currentProfile?.ownedBy?.slice(0, 9) + '...' + currentProfile?.ownedBy?.slice(-4)
                  : ''}
              </p>
              {/* {currentProfile?.artistApprovalStatus === 'approved' && (
              <span className="heading-6 pb-3 text-blue-900 text-center">Artist </span>
            )} */}
            </div>
          </div>
          <div className="col-span-4 pt-10 md:pt-0">
            <form onSubmit={handleSubmit(updateUserProfileData)} className="flex flex-col gap-4">
              <div className="flex justify-between items-center pb-2 border-b border-primary">
                <p className="heading-5 ">Personal details</p>
                {currentProfile?.artistApprovalStatus === 'approved' && (
                  <Button
                    disabled
                    additionalClasses="heading-6 pb-3 text-white text-center"
                    name="Artist"
                    type="button"
                    variant="outline"
                  />
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Input
                    type="text"
                    name="firstName"
                    label="Name"
                    placeholder="Enter your name"
                    register={register}
                    required
                    pattern={NAME_REGEX}
                  />
                  {errors.firstName && errors.firstName.type === 'pattern' && (
                    <p className={errorMessageClassName}>Enter your name correctly</p>
                  )}
                  {errors.firstName && errors.firstName.type === 'required' && (
                    <p className={errorMessageClassName}>Enter your name</p>
                  )}
                </div>
                <div>
                  <Input
                    type="text"
                    name="userName"
                    label="User name"
                    placeholder="Enter your user name"
                    register={register}
                    disabled
                    required
                  />
                  {/* {errors.userName && errors.userName.type === 'pattern' && (
                  <p className={errorMessageClassName}>Enter your user name</p>
                )} */}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-2 md:gap-4">
                <div>
                  <Input
                    type="email"
                    name="email"
                    label="Email"
                    placeholder="Enter your email "
                    register={register}
                    required
                    pattern={EMAIL_REGEX}
                  />
                  {errors.email && errors.email.type === 'pattern' && (
                    <p className={errorMessageClassName}>Enter your correct email id</p>
                  )}
                  {errors.email && errors.email.type === 'required' && (
                    <p className={errorMessageClassName}>Enter your email id</p>
                  )}
                </div>
                {/* <p
              className='paragraph-2 md:paragraph-1 cursor-pointer w-28 text-tertiary flex items-center md:mt-6'
              onClick={() => console.log('Verify Email')}
            >
              Verify email
            </p> */}
              </div>
              <TextArea
                type="text"
                name="bio"
                label="Bio"
                placeholder="Explain about yourself"
                register={register}
                rows={4}
              />
              <p className="heading-5 pb-2 pt-8 border-b border-primary">Social Media</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Input
                    type="text"
                    name="website"
                    label="Website"
                    placeholder="www.f3rn.com"
                    register={register}
                    pattern={URL_REGEX}
                    prefix="https"
                  />
                  {errors.website && errors.website.type === 'pattern' && (
                    <p className={errorMessageClassName}>Enter your valid website URL</p>
                  )}
                </div>
                <div>
                  <Input
                    type="text"
                    name="instagram"
                    label="Instagram"
                    prefix="https"
                    placeholder="www.instagram.com/f3rn/"
                    pattern={URL_REGEX}
                    register={register}
                    required
                  />
                  {errors.instagram && errors.instagram.type === 'pattern' && (
                    <p className={errorMessageClassName}>Enter your valid Instagram profile URL</p>
                  )}
                  {errors.instagram && errors.instagram.type === 'required' && (
                    <p className={errorMessageClassName}>Enter your Instagram profile URL</p>
                  )}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  name="twitter"
                  label="Twitter"
                  prefix="https"
                  placeholder="www.twitter.com/f3rnapp/"
                  register={register}
                  pattern={URL_REGEX}
                />
              </div>
              {errors.instagram && errors.instagram.type === 'pattern' && (
                <p className={errorMessageClassName}>Enter your valid Twitter profile URL</p>
              )}
              {/* <div className='grid md:grid-cols-2 gap-4'>
            <MultiSelect
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
              placeholder='Select...'
              name='options'
              label='Options'
              options={items}
              multiSelectError={multiSelectError}
              setMultiSelectError={setMultiSelectError}
            />
          </div> */}
              {/* Enable Dispatcher Component */}
              <p className="heading-5 pb-2 pt-8 border-b border-primary">Dispatcher</p>
              <div className="flex">
                <EnableDispatcher />
              </div>

              <div className="mt-4">
                <Button
                  variant="primary"
                  disabled={isLoading || !isDirty}
                  additionalClasses={isLoading || !isDirty ? 'cursor-not-allowed' : ''}
                  name={isLoading ? 'Saving...' : 'Save'}
                  type="submit"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
