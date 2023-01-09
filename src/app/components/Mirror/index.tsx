import React from 'react'

import {useMutation} from '@apollo/client'
import {ArrowsRightLeftIcon} from '@heroicons/react/24/solid'
import {
  BroadcastDocument,
  CreateMirrorRequest,
  CreateMirrorTypedDataDocument,
  CreateMirrorViaDispatcherDocument,
  Mutation,
} from 'graphql/generated/types'
import {pollUntilIndexed} from 'graphql/utils/hasTransactionIndexed'
import {useState} from 'react'
import toast from 'react-hot-toast'
import {useNavigate} from 'react-router-dom'
import getSignature from 'utils/getSignature'
import {Loader} from '../atoms/Loader'
import {handleSignTypeData} from 'graphql/utils/signMessage'
import WalletConnector from '../WalletSelector'
import {useAppStore} from 'store/app'

function Mirror({publicationId, mirrorCounts, primary}: any) {
  const navigate = useNavigate()

  const isLoggedIn = useAppStore((state) => state.isLoggedIn)
  const userSignNonce = useAppStore((state) => state.userSigNonce)
  const currentProfile = useAppStore((state) => state.currentProfile)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [ifUserNotLoggedInShowModal, setIfUserNotLoggedInShowModal] = useState<boolean>(false)

  const [createMirrorViaDispatcher] = useMutation<Mutation>(CreateMirrorViaDispatcherDocument, {
    onCompleted: (data) => {
      if (data.createMirrorViaDispatcher.__typename === 'RelayerResult') {
        setIsLoading(false)
        toast.success('Successfully mirrored')
        console.log('txId', {txId: data.createMirrorViaDispatcher})
      }
    },
    onError(error) {
      console.log(error)
    },
  })
  const [broadcast] = useMutation(BroadcastDocument)
  const [CreateMirrorTypedData] = useMutation<Mutation>(CreateMirrorTypedDataDocument)

  const handleCreateMirror = async (request: CreateMirrorRequest) => {
    try {
      const result = await CreateMirrorTypedData({
        variables: {
          options: {overrideSigNonce: userSignNonce},
          request,
        },
      })

      const typedData = result.data?.createMirrorTypedData.typedData

      // const signatureTyped = getSignature(typedData);
      // const signature = await signTypedDataAsync(signatureTyped);
      const signature = await handleSignTypeData(getSignature(typedData))
      const broadcastResult = await broadcast({
        variables: {
          request: {
            id: result?.data?.createMirrorTypedData.id,
            signature: signature,
          },
        },
      })

      if (broadcastResult.data?.broadcast.__typename === 'RelayerResult') {
        const txId = broadcastResult.data?.broadcast?.txId!

        const res = pollUntilIndexed({txId}, setIsLoading, navigate)
        toast.promise(res, {
          loading: 'Indexing...',
          success: 'Post has been mirrored',
          error: 'Could not mirrored',
        })
        await res
        // navigate(PageRoutes.DISCOVERY);
        if (broadcastResult.data?.broadcast.__typename !== 'RelayerResult') {
          console.error('create profile metadata via broadcast: failed', broadcastResult)
        } else
          console.log('create profile metadata via broadcast: broadcastResult', broadcastResult)
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const createViaDispatcher = async (request: CreateMirrorRequest) => {
    const {data} = await createMirrorViaDispatcher({
      variables: {request},
    })

    if (data?.createMirrorViaDispatcher?.__typename === 'RelayError') {
      handleCreateMirror(request)
    }
  }

  const CreateMirroredPost = async () => {
    if (!isLoggedIn) {
      return setIfUserNotLoggedInShowModal(true)
    }
    setIsLoading(true)
    const request = {
      profileId: currentProfile?.id,
      publicationId: publicationId,
      referenceModule: {
        followerOnlyReferenceModule: false,
      },
    }

    if (currentProfile?.dispatcher?.canUseRelay) {
      createViaDispatcher(request)
    } else {
      handleCreateMirror(request)
    }
  }

  return (
    <>
      <WalletConnector
        openModal={ifUserNotLoggedInShowModal}
        setIsLoading={setIfUserNotLoggedInShowModal}
      />
      <div className='flex items-center gap-1'>
        {isLoading ? (
          <div className='flex justify-center items-center  w-8 h-8'>
            <Loader />
          </div>
        ) : (
          <div
            title='add to ArtBoard'
            onClick={CreateMirroredPost}
            className={`flex justify-center items-center  w-8 h-8 rounded-full cursor-pointer space-x-1 ${
              primary ? 'hover:bg-gray-200' : 'hover:bg-gray-800'
            }`}
          >
            <ArrowsRightLeftIcon className={`w-5 ${primary ? 'text-primary' : 'text-white '}`} />
          </div>
        )}
        <div className={`w-5 ${primary ? 'text-primary' : 'text-white '}`}>{mirrorCounts}</div>
      </div>
    </>
  )
}

export default Mirror
