import {useLazyQuery, useMutation} from '@apollo/client'
import {useState, useEffect} from 'react'
import {useForm} from 'react-hook-form'
import {
  BroadcastDocument,
  CreatePublicSetProfileMetadataUriRequest,
  CreateSetProfileMetadataTypedDataDocument,
  CreateSetProfileMetadataViaDispatcherDocument,
  Mutation,
  ProfileDocument,
} from 'graphql/generated/types'
import {v4 as uuidv4} from 'uuid'
import toast from 'react-hot-toast'
import {useNavigate} from 'react-router-dom'
import getSignature from 'utils/getSignature'
import config, {PageRoutes} from 'utils/config'

import storeFiles from 'utils/web3Storage'
import {pollUntilIndexed} from 'graphql/utils/hasTransactionIndexed'
import {getBackendProfile} from 'utils/generateNonce'
import {isEmpty} from 'utils/utility'

import SettingsView from './view'
import {handleSignTypeData} from 'graphql/utils/signMessage'
import {useAppStore} from 'store/app'
import RefreshModal from 'app/components/Modal/refreshModal'

//TODO: In future need to resolve the artistStatus function

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
  const [openRefreshModal, setOpenRefreshModal] = useState<boolean>(false)
  const [, setOpenRefreshModalFalse] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: {errors, isDirty}, //isDirty gives boolean value ->if input field value is changed by user then isDirty will automatically becomes true otherwise it will be false.
    setValue,
  } = useForm({
    mode: 'onBlur',
  })

  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const account = useAppStore((state) => state.setWalletAddress)
  const currentProfile = useAppStore((state) => state.currentProfile)
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile)

  const [broadcast] = useMutation(BroadcastDocument)
  const [getProfile] = useLazyQuery(ProfileDocument)

  const [createSetProfileMetadataTypedData] = useMutation(CreateSetProfileMetadataTypedDataDocument)

  // const getProfileResultFromBackend = async () => {
  //   const getProfileResult = await getBackendProfile()
  //   const profile = await getProfile({
  //     variables: {
  //       request: {
  //         profileId: currentProfile?.id,
  //       },
  //     },
  //   })

  //   //@ts-ignore
  //   setCurrentProfile({
  //     ...profile.data?.profile,
  //     artistApprovalStatus: getProfileResult?.artist_approval_status,
  //   })
  // }

  const updateProfile = async (request: CreatePublicSetProfileMetadataUriRequest) => {
    try {
      const result = await createSetProfileMetadataTypedData({
        variables: {
          request,
        },
      })

      const typedData = result.data?.createSetProfileMetadataTypedData.typedData

      const signatureTyped = getSignature(typedData)
      const signature = await handleSignTypeData(signatureTyped)

      const broadcastResult = await broadcast({
        variables: {
          request: {
            id: result?.data?.createSetProfileMetadataTypedData.id,
            signature: signature,
          },
        },
      })

      if (broadcastResult.data?.broadcast.__typename === 'RelayerResult') {
        const txId = broadcastResult.data?.broadcast?.txId!
        const showRefreshModal = true
        const indexerResult = pollUntilIndexed({txId}, setIsLoading, navigate, showRefreshModal)

        toast.promise(indexerResult, {
          loading: 'Indexing...',
          success: 'Please refresh the page now, to see updated data',
          error: 'Could not update',
        })

        await indexerResult

        // getProfileResultFromBackend();
        setOpenRefreshModal(true)
      }

      if (broadcastResult.data?.broadcast.__typename !== 'RelayerResult') {
        console.error('create profile metadata via broadcast: failed', broadcastResult)
      } else console.log('create profile metadata via broadcast: broadcastResult', broadcastResult)
      setIsLoading(false)
    } catch ({message}) {
      toast.error(`${message}`)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (currentProfile && Object.keys(currentProfile).length !== 0) {
      setValue('firstName', currentProfile.name)
      setValue('userName', currentProfile.handle)
      setValue('bio', currentProfile.bio)
      setValue(
        'website',
        currentProfile?.attributes?.filter((attribute: any) => attribute?.key === 'website')[0]
          ?.value,
      )
      setValue(
        'twitter',
        currentProfile?.attributes?.filter((attribute: any) => attribute?.key === 'twitter')[0]
          ?.value,
      )
      setValue(
        'email',
        currentProfile?.attributes?.filter((attribute: any) => attribute?.key === 'email')[0]
          ?.value,
      )
      setValue(
        'instagram',
        currentProfile?.attributes?.filter((attribute: any) => attribute?.key === 'instagram')[0]
          ?.value,
      )
    }
  }, [currentProfile, account])

  const [updateProfileViaDispatcher] = useMutation<Mutation>(
    CreateSetProfileMetadataViaDispatcherDocument,
    {
      onCompleted: (data) => {
        if (data.createSetProfileMetadataViaDispatcher.__typename === 'RelayerResult') {
          console.log('txId', {txId: data.createSetProfileMetadataViaDispatcher})
          // getProfileResultFromBackend();
          toast.success('Data is updated')
          setIsLoading(false)
          setOpenRefreshModal(true)
        }
      },
      onError(error) {
        console.log(error)
      },
    },
  )

  const updateViaDispatcher = async (request: CreatePublicSetProfileMetadataUriRequest) => {
    const {data} = await updateProfileViaDispatcher({
      variables: {request},
    })

    if (data?.createSetProfileMetadataViaDispatcher?.__typename === 'RelayError') {
      updateProfile(request)
    }
  }

  const getUrlValue = (value: string | undefined) => {
    return value?.includes('http://') || value?.includes('https://') ? value?.split('//')[1] : value
  }

  const updateUserProfileData = async (formData: any) => {
    try {
      setIsLoading(true)
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
      }

      const uploadToWeb3result = await storeFiles(dataObject)
      const createProfileMetadataRequest = {
        profileId: currentProfile?.id,
        metadata: `https://${uploadToWeb3result}.ipfs.w3s.link/hello.json`,
      }

      if (currentProfile?.dispatcher?.canUseRelay) {
        updateViaDispatcher(createProfileMetadataRequest)
      } else {
        updateProfile(createProfileMetadataRequest)
      }
    } catch (error: any) {
      setIsLoading(false)
      console.log(error)
      toast.error('Something went wrong')
    }
  }
  const SignUpForArtist = () => {
    const name = currentProfile?.name
    const email = currentProfile?.attributes?.filter(
      (attribute: any) => attribute?.key === 'email',
    )[0]?.value
    // const website = currentProfile?.attributes?.filter((attribute: any) => attribute?.key === 'website')[0]?.value;
    const instagram = currentProfile?.attributes?.filter(
      (attribute: any) => attribute?.key === 'instagram',
    )[0]?.value

    if (isEmpty(name)) {
      toast.error('Please update your name')
    } else if (isEmpty(email)) {
      toast.error('Please update your email')
    } else if (isEmpty(instagram)) {
      toast.error('Please update your instagram url')
    } else navigate(PageRoutes.SIGN_UP_ARTIST)
  }
  const checkRequestStatus = async () => {
    try {
      const getProfileResult = await getBackendProfile()

      const profile = await getProfile({
        variables: {
          request: {
            profileId: currentProfile?.id,
          },
        },
      })
      if (getProfileResult?.artist_approval_status === 'approved')
        toast.success('Congratulations, Your Request has been Approved.')
      if (getProfileResult?.artist_approval_status === 'pending')
        toast("Your request hasn't been approved yet.", {
          icon: '⏲',
        })

      //@ts-ignore
      setCurrentProfile({
        ...profile.data?.profile,
        artistApprovalStatus: getProfileResult?.artist_approval_status,
      })
    } catch (error) {
      console.log(error)
    }
  }

  // if (userProfileDataLoader) {
  //   return <OverlayLoader />;
  // }

  return (
    <>
      <RefreshModal
        openRefreshModal={openRefreshModal}
        setOpenRefreshModal={setOpenRefreshModal}
        setOpenRefreshModalFalse={setOpenRefreshModalFalse}
      />
      <SettingsView
        isLoading={isLoading}
        currentProfile={currentProfile}
        SignUpForArtist={SignUpForArtist}
        checkRequestStatus={checkRequestStatus}
        handleSubmit={handleSubmit}
        updateUserProfileData={updateUserProfileData}
        register={register}
        errors={errors}
        isDirty={isDirty}
      />
    </>
  )
}

export default Settings
