import ART_PREVIEW from 'Assets/Images/artPreview.png';
import { ArrowsRightLeftIcon, ArrowLongRightIcon } from '@heroicons/react/24/outline';
import { HeartIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';

import { TextArea } from 'app/components/atoms/FormElements';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { WalletContext } from 'store/WalletContextProvider';
import { PublicationDocument } from 'graphql/generated/types';
import { useQuery } from '@apollo/client';
import FullPageLoader from 'app/components/FullPageLoader';
import getIPFSLink from 'utils/getIPFSLink';
import { PageRoutes } from 'utils/config';
import { Button } from 'app/components/atoms/Buttons';
import ArtPreviewSkelton from 'app/components/Skelton/ArtPreviewSkelton';

const ArtPreviewScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    currentProfileState: { currentProfile },
  }: any = useContext(WalletContext);

  const { data, loading, error } = useQuery(PublicationDocument, {
    variables: {
      request: { publicationId: id },
      reactionRequest: currentProfile ? { profileId: currentProfile?.id } : null,
      profileId: currentProfile?.id ?? null,
    },
    skip: !id,
  });
  console.log(data);
  const { register } = useForm();

  useEffect(() => {
    window.scroll(0, 0);
  }, []);
  return (
    <div>
      {loading ? (
        <ArtPreviewSkelton />
      ) : (
        <div className="main-container md:h-[82.5vh] mt-24 mb-24 md:mb-auto md:mt-24">
          <div className="pt-2 pb-6  flex items-center gap-x-2 cursor-pointer" onClick={() => navigate(-1)}>
            <ArrowLeftIcon className="h-6 w-6" />
            <p className="heading-5">back</p>
          </div>
          <div className="grid grid-cols-6 ">
            <div className="col-span-6 md:col-span-3 border rounded-l-lg border-r-0">
              {
                <img
                  className="object-contain p-4 w-full h-[600px]"
                  src={
                    data?.publication?.metadata.image !== null
                      ? getIPFSLink(data?.publication?.metadata?.image)
                      : ART_PREVIEW
                  }
                  alt={data && data?.publication?.id}
                />
              }
            </div>
            <div className="col-span-6 md:col-span-3 sm:border border-l-0 rounded-r-lg">
              <div className="flex flex-col justify-center">
                <div className="flex justify-between items-center bg-gray-30 px-6">
                  <Link
                    to={PageRoutes.USER_PROFILE.split(':')[0] + data?.publication?.profile?.id}
                    className="flex items-center h-20 gap-2"
                  >
                    <img
                      className="w-8 h-8 rounded-full border border-secondary"
                      // @ts-ignore
                      src={data?.publication?.profile?.picture?.original!.url! ?? ART_PREVIEW}
                      alt={data?.publication?.profile?.name ?? 'F3RN'}
                    />
                    <div className="text-primary  border-gray-500 ">
                      <p>{data && data?.publication?.metadata.name?.split('y')[1]}</p>
                    </div>
                  </Link>
                  {/* <div>
                    <Button name="Follow" type="button" variant="outline" />
                  </div> */}
                </div>
                <div className="px-6">
                  <div className="flex items-center text-gray-40 gap-2 pt-5 md:pt-8 ">
                    <p>
                      {data &&
                        new Date(data.publication?.createdAt).toLocaleString('en-in', {
                          timeStyle: 'short',
                        })}
                    </p>
                    <p>-</p>
                    <p>
                      {data &&
                        new Date(data.publication?.createdAt).toLocaleString('en-in', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                    </p>
                  </div>
                  <h1 className="heading-4 border-b capitalize">{data?.publication?.metadata.content}</h1>
                  <p className=" paragraph-1 lg:w-full break-words pt-5 text-gray-500 overflow-auto max-h-96">
                    {data?.publication?.metadata.description.length > 0
                      ? data?.publication?.metadata.description
                      : 'No description available'}
                  </p>
                </div>
              </div>

              {/* <div className="mt-14 md:mt-20 lg:mt-28">
                <div className="flex space-x-4">
                  <HeartIcon className="w-6" />
                  <ArrowsRightLeftIcon className="w-6" />
                </div>

                <TextArea
                  type="text"
                  name="explain_about_yourself"
                  label=""
                  placeholder="Comment Here..."
                  register={register}
                  required
                  rows={4}
                />
                <ArrowLongRightIcon className="w-8 ml-auto -mt-8 mr-2 " />
              </div> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtPreviewScreen;
