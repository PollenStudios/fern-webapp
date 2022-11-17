import { useMutation } from '@apollo/client';
import { useContext, useState } from 'react';
import { WalletContext } from 'store/WalletContextProvider';
import { v4 as uuidv4 } from 'uuid';
import { Buffer } from 'buffer';
import {
  BroadcastDocument,
  CreatePostTypedDataDocument,
  CreatePostViaDispatcherDocument,
  CreatePublicPostRequest,
  HasTxHashBeenIndexedDocument,
  HasTxHashBeenIndexedRequest,
  Mutation,
  PublicationMainFocus,
} from 'graphql/generated/types';
import getSignature from 'utils/getSignature';
import { Input, TextArea } from 'app/components/atoms/FormElements';
import { useForm } from 'react-hook-form';
import trimify from 'utils/trimify';
import { Button } from 'app/components/atoms/Buttons';
import { Web3Storage } from 'web3.storage';
import config from 'utils/config';
import toast from 'react-hot-toast';
import getUserLocale from 'utils/getUserLocale';
import axios from 'axios';
import { useSignTypedData } from 'wagmi';
import Client from 'utils/apolloClient';
import { pollUntilIndexed } from 'graphql/utils/hasTransactionIndexed';
import { Loader } from 'app/components/atoms/Loader';
import { ImagePreviewer } from 'app/components/atoms/UploadFiles';
import ArtPreview from 'Assets/Images/artPreview.png';
import { Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import OverlayLoader from 'app/components/OverlayLoader';
import { apiRoutes } from 'API/apiRoutes';

function Post() {
  const navigate = useNavigate();
  const {
    userSigNonceState: {
      userSigNonce: { userSignNonce },
    },
    currentProfileState: { currentProfile },
  }: any = useContext(WalletContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [attachment, setAttachment] = useState<any>();
  const [avatar, setAvatar] = useState<any>();
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [broadcast] = useMutation(BroadcastDocument);

  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData();

  function makeStorageClient() {
    return new Web3Storage({
      token: config.w3StorageToken,
    });
  }

  async function storeFiles(files: any) {
    try {
      const client = makeStorageClient();
      const cid = await client.put(files);
      console.log('stored files with Web3Storage: cid:', cid);
      // toast.success('File Successfully Stored on Web3');
      return cid;
    } catch (error) {
      console.log(error);
      toast.error('Error storing File on web3');
    }
  }

  const getMainContentFocus = () => {
    if (attachment) {
      return PublicationMainFocus.Image;
    } else {
      return PublicationMainFocus.TextOnly;
    }
  };

  const attributes = [
    {
      traitType: 'type',
      displayType: 'string',
      value: getMainContentFocus()?.toLowerCase(),
    },
  ];

  const [createPostTypedData] = useMutation<Mutation>(CreatePostTypedDataDocument);

  const [createPostViaDispatcher] = useMutation(CreatePostViaDispatcherDocument, {
    onCompleted: data => {
      if (data.createPostViaDispatcher.__typename === 'RelayerResult') {
        console.log('txId', { txId: data.createPostViaDispatcher });
      }
    },
  });

  const createViaDispatcher = async (request: CreatePublicPostRequest) => {
    const { data } = await createPostViaDispatcher({
      variables: { request },
    });

    if (data?.createPostViaDispatcher?.__typename === 'RelayError') {
      const result = await createPostTypedData({
        variables: {
          // options: { overrideSigNonce: userSignNonce },
          request,
        },
      });

      const typedData = result.data?.createPostTypedData.typedData;

      const signatureTyped = getSignature(typedData);
      const signature = await signTypedDataAsync(signatureTyped);
      const broadcastResult = await broadcast({
        variables: {
          request: {
            id: result?.data?.createPostTypedData.id,
            signature: signature,
          },
        },
      });

      if (broadcastResult.data?.broadcast.__typename === 'RelayerResult') {
        const txId = broadcastResult.data?.broadcast?.txId!;

        await pollUntilIndexed({ txId });
        // console.log('indexerResult', indexerResult);
      }

      setIsLoading(false);
      if (broadcastResult.data?.broadcast.__typename !== 'RelayerResult') {
        console.error('create profile metadata via broadcast: failed', broadcastResult);
      } else console.log('create profile metadata via broadcast: broadcastResult', broadcastResult);
    }
  };

  const handleUpload = async (value: any) => {
    setAvatar(value);
    setImageLoading(true);
    console.log(value);
    try {
      const formBodyData = new FormData();
      formBodyData.append('name', 'name');
      formBodyData.append('file', value);
      const { data } = await axios({
        method: 'post',
        url: config.backendUri + apiRoutes.uploadMedia,
        headers: {
          Authorization: 'TOKEN  ' + localStorage.getItem('backendToken'),
        },
        data: formBodyData,
      });
      if (data.file) {
        setAttachment(data.file);

        setImageLoading(false);
        toast.success('Image successfully uploaded');
      }
      setImageLoading(false);
    } catch (error) {
      setImageLoading(false);
      toast.error('Unable to upload');
    }
  };

  const CreatePost = async (formData: any) => {
    try {
      if (!attachment) {
        toast.error('Please select a image');
        return 0;
      }
      setIsLoading(true);
      // console.log('currentProfile', currentProfile, userSignNonce);

      const dataObject = {
        version: '2.0.0',
        metadata_id: uuidv4(),
        description: trimify(formData.description),
        content: trimify(formData.title),
        external_url: `https://lenster.xyz/u/${currentProfile?.handle}`,
        image: attachment,
        imageMimeType: 'image/svg+xml',
        name: `Post by @${currentProfile?.handle}`,
        // tags: getTags(publicationContent),
        // animation_url: getAnimationUrl(),
        mainContentFocus: getMainContentFocus(),
        contentWarning: null, // TODO
        attributes,
        media: [{ item: attachment, type: 'image/png', altTag: '' }],
        locale: getUserLocale(),
        createdOn: new Date(),
        appId: config.APP_NAME,
      };

      const buffer = Buffer.from(JSON.stringify(dataObject));

      const files = [new File([buffer], `hello.json`)];
      const uploadToWeb3result = await storeFiles(files);

      const request = {
        profileId: currentProfile?.id,
        contentURI: `https://${uploadToWeb3result}.ipfs.w3s.link/hello.json`,
        collectModule: { freeCollectModule: { followerOnly: false } },
        referenceModule: { followerOnlyReferenceModule: false },
      };

      if (currentProfile?.dispatcher?.canUseRelay) {
        createViaDispatcher(request);
      } else {
        const result = await createPostTypedData({
          variables: {
            options: { overrideSigNonce: userSignNonce },
            request,
          },
        });

        const typedData = result.data?.createPostTypedData.typedData;

        const signatureTyped = getSignature(typedData);
        const signature = await signTypedDataAsync(signatureTyped);
        const broadcastResult = await broadcast({
          variables: {
            request: {
              id: result?.data?.createPostTypedData.id,
              signature: signature,
            },
          },
        });

        if (broadcastResult.data?.broadcast.__typename === 'RelayerResult') {
          const txId = broadcastResult.data?.broadcast?.txId!;
          const res = pollUntilIndexed({ txId });

          toast.promise(res, {
            loading: 'Indexing...',
            success: <b>Profile Updated!</b>,
            error: <b>Could not update.</b>,
          });
          await res;
          navigate('/');

          setIsLoading(false);
        }

        if (broadcastResult.data?.broadcast.__typename !== 'RelayerResult') {
          setIsLoading(false);
          console.error('create profile metadata via broadcast: failed', broadcastResult);
        } else console.log('create profile metadata via broadcast: broadcastResult', broadcastResult);
      }
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <div className="md:main-container flex flex-col justify-center w-full md:w-[50vw] xl:w-[40vw] min-h-[72.5vh]  my-24">
      {/* <div className="   "> */}
      {isLoading && <OverlayLoader />}
      <div className="flex flex-col px-10 gap-y-6 border">
        <div className="border-b  py-2 flex items-center gap-x-2 cursor-pointer" onClick={() => navigate(-1)}>
          <ArrowLeftIcon className="h-6 w-6" />
          <p className="heading-5">Create new post</p>
        </div>

        <div className="flex flex-col py-10">
          <div>
            <ImagePreviewer imagePreview={avatar && URL.createObjectURL(avatar)} />
            <div className="flex flex-col mt-6">
              <input
                className="w-full  border-dotted"
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
          </div>
          <form onSubmit={handleSubmit(CreatePost)} className="">
            <div className="mt-6 space-y-5">
              <div>
                <Input type="text" name="title" label="Title *" placeholder="Title" register={register} required />
                {errors.title && errors.title.type === 'required' && (
                  <p className="text-red-600 pt-2">Please enter your title</p>
                )}
              </div>
              <div>
                <TextArea
                  type="text"
                  name="description"
                  label="Description *"
                  placeholder="Description"
                  rows={6}
                  register={register}
                  required
                />
                {errors.description && errors.description.type === 'required' && (
                  <p className="text-red-600 pt-2">Please enter your description</p>
                )}
              </div>
              <Button
                name={isLoading ? 'Posting...' : 'Post'}
                variant="primary"
                type={'submit'}
                disabled={isLoading || imageLoading}
                additionalClasses={isLoading || imageLoading ? 'cursor-not-allowed' : ''}
              />
            </div>
          </form>
        </div>
        {/* <div className="flex flex-col mt-2">
          <input
            className="w-60 border"
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
        </div> */}
        {/* <div className="flex flex-col md:grid md:grid-cols-12 gap-4">
          <div className="md:col-span-5">
            <ImagePreviewer imagePreview={attachment} />
            <div className="flex flex-col mt-6">
              <input
                className="w-full border"
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
          </div>
          <form onSubmit={handleSubmit(CreatePost)} className="col-span-7">
            <div className="col-span-6 md:col-span-3 mt-6 space-y-5">
              <div>
                <Input type="text" name="title" label="Title" placeholder="Title" register={register} required />
                {errors.title && errors.title.type === 'required' && (
                  <p className="text-red-600 pt-2">Please enter your title</p>
                )}
              </div>
              <div>
                <TextArea
                  type="text"
                  name="description"
                  label="Description"
                  placeholder="Description"
                  rows={6}
                  register={register}
                  required
                />
                {errors.description && errors.description.type === 'required' && (
                  <p className="text-red-600 pt-2">Please enter your description</p>
                )}
              </div>
              <Button
                name={isLoading ? 'Posting...' : 'Post'}
                variant="primary"
                type={'submit'}
                disabled={isLoading || imageLoading}
                additionalClasses={isLoading || imageLoading ? 'cursor-not-allowed' : ''}
              />
            </div>
          </form>
        </div> */}
      </div>
    </div>
    // </div>
  );
}

export default Post;
