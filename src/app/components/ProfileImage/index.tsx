import React from 'react'
import {useMutation} from '@apollo/client'
import axios from 'axios'
import {useState} from 'react'
import {
  CreateSetProfileImageUriTypedDataDocument,
  Mutation,
  CreateSetProfileImageUriViaDispatcherDocument,
  UpdateProfileImageRequest,
} from 'graphql/generated/types'
import useBroadcast from 'hooks/useBroadcast'
import getSignature from 'utils/getSignature'
import {Button} from 'app/components/atoms/Buttons'
import ProfileLogo from './assets/defaultLogo.png'
import {toast} from 'react-hot-toast'
import config from 'utils/config'
import {Loader} from '../atoms/Loader'
import {pollUntilIndexed} from 'graphql/utils/hasTransactionIndexed'
import OverlayLoader from '../OverlayLoader'
import {apiRoutes} from 'API/apiRoutes'
import {backendToken} from 'utils/getBackendToken'
import {useNavigate} from 'react-router-dom'
import {handleSignTypeData} from 'graphql/utils/signMessage'
import {useAppStore} from 'store/app'

import RefreshModal from '../Modal/refreshModal'

function ProfileImage() {
  const navigate = useNavigate()

  const currentProfile = useAppStore((state) => state.currentProfile)
  const userSignNonce = useAppStore((state) => state.userSigNonce)

  const [loading, setLoading] = useState(false)

  const [image, setImage] = useState<any>()
  const [avatar, setAvatar] = useState<any>()
  const [imageLoading, setImageLoading] = useState<boolean>(false)
  const [openRefreshModal, setOpenRefreshModal] = useState<boolean>(false)

  const {broadcast} = useBroadcast({
    onCompleted: (data) => {
      console.log('data_useBroadcast', data)
    },
  })

  const [createSetProfileImageURIViaDispatcher] = useMutation(
    CreateSetProfileImageUriViaDispatcherDocument,
    {
      onCompleted: (data) => {
        if (data.createSetProfileImageURIViaDispatcher.__typename === 'RelayerResult') {
          setLoading(false)
          toast.success('Profile image updated successfully')
          console.log('txId Dispatcher', {txId: data.createSetProfileImageURIViaDispatcher})
          setOpenRefreshModal(true)
        }
      },
      onError(error) {
        console.log(error)
      },
    },
  )

  const [createSetProfileImageURITypedData] = useMutation<Mutation>(
    CreateSetProfileImageUriTypedDataDocument,
    {
      onCompleted: async ({createSetProfileImageURITypedData}) => {
        try {
          const {id, typedData} = createSetProfileImageURITypedData
          // const signature = await signTypedDataAsync(getSignature(typedData));
          const signature = await handleSignTypeData(getSignature(typedData))

          const broadcastResult = await broadcast({request: {id, signature}})

          if (broadcastResult.data?.broadcast.__typename === 'RelayerResult') {
            const txId = broadcastResult.data?.broadcast?.txId!
            // await pollUntilIndexed({ txId });
            const showRefreshModal = true
            const res = pollUntilIndexed({txId}, setLoading, navigate, showRefreshModal)
            toast.promise(res, {
              loading: 'Indexing...',
              success: 'Profile updated',
              error: 'Could not update',
            })
            await res
            setOpenRefreshModal(true)
          }
          if (broadcastResult.data?.broadcast.__typename !== 'RelayerResult') {
            console.error('create profile metadata via broadcast: failed', broadcastResult)
          } else
            console.log('create profile metadata via broadcast: broadcastResult', broadcastResult)
        } catch (error: any) {
          console.log(error)
          toast.error(error.message)
        } finally {
          setLoading(false)
        }
      },
      onError(error) {
        console.log(error)
      },
    },
  )

  const setProfileImageViaDispatcher = async (request: UpdateProfileImageRequest) => {
    const {data} = await createSetProfileImageURIViaDispatcher({
      variables: {request},
    })

    if (data?.createSetProfileImageURIViaDispatcher?.__typename === 'RelayError') {
      await createSetProfileImageURITypedData({
        variables: {
          options: {overrideSigNonce: userSignNonce},
          request,
        },
      })
    }
  }

  const handleUpload = async (value: any) => {
    // value.preventDefault();
    // setUploading(true);
    setAvatar(value)
    setImageLoading(true)
    try {
      const formBodyData = new FormData()
      // @ts-ignore
      formBodyData.append('name', currentProfile?.name)
      formBodyData.append('file', value)
      const {data} = await axios({
        method: 'post',
        url: config.baseUrl + apiRoutes.uploadMedia,
        headers: {
          Authorization: 'TOKEN ' + backendToken(),
        },
        data: formBodyData,
      })
      if (data.file) {
        setImage(data.file)
        setImageLoading(false)
      }
    } catch (error) {
      setImageLoading(false)
      console.log('error in image loading', error)
      // setAvatar(currentProfile?.picture?.original?.url);
    }
  }

  const uploadImageToLens = async (image: string) => {
    if (avatar) {
      const request = {
        profileId: currentProfile?.id,
        url: image,
      }
      setLoading(true)
      if (currentProfile?.dispatcher?.canUseRelay) {
        setProfileImageViaDispatcher(request)
      } else {
        await createSetProfileImageURITypedData({
          variables: {
            options: {overrideSigNonce: userSignNonce},
            request,
          },
        })
      }
    }
  }
  return (
    <>
      <RefreshModal openRefreshModal={openRefreshModal} setOpenRefreshModal={setOpenRefreshModal} />
      <div className='col-span-2 '>
        {loading && <OverlayLoader />}
        <div className='rounded-full  flex justify-center'>
          <img
            className='rounded-full object-cover border  w-48 h-48'
            src={
              avatar
                ? URL.createObjectURL(avatar)
                : // @ts-ignore
                  currentProfile?.picture?.original?.url ?? ProfileLogo
            }
            alt={currentProfile?.name ?? currentProfile?.id}
            loading='lazy'
          />
        </div>
        <div className='flex justify-center items-center flex-col gap-2 my-8'>
          <input
            className=' border file:bg-white file:border-gray-20 file:border file:px-3 file:py-1 file:rounded-full'
            type='file'
            accept='.png, .jpg, .jpeg, .gif'
            onChange={(e) => {
              e.target.files && handleUpload(e.target.files[0])
            }}
          />
          {imageLoading && (
            <div className='pt-2 flex items-center gap-4'>
              <p className=''>Uploading</p>
              <Loader />
            </div>
          )}
        </div>
        <div className='flex justify-center'>
          {loading ? (
            <div className='bg-white min-w-[170px] py-2 sm:py-3 border text-base font-medium rounded-full shadow-sm text-primary focus:outline-none'>
              <Loader className='text-primary' />
            </div>
          ) : (
            <Button
              type='button'
              additionalClasses={avatar === undefined || imageLoading ? 'cursor-not-allowed' : ''}
              variant='outline'
              name='Update Image'
              onClick={() => uploadImageToLens(image)}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default ProfileImage
