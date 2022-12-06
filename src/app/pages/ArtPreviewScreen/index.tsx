import ART_PREVIEW from 'Assets/Images/artPreview.png';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { WalletContext } from 'store/WalletContextProvider';
import { PublicationDocument } from 'graphql/generated/types';
import { useQuery } from '@apollo/client';
import getIPFSLink from 'utils/getIPFSLink';
import { PageRoutes } from 'utils/config';
import ArtPreviewSkelton from 'app/components/Skelton/ArtPreviewSkelton';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import ProfileLogo from 'Assets/Images/defaultLogo.png';

import Mirror from 'app/components/Mirror';

const ArtPreviewScreen = () => {
  const { id: publicationId } = useParams();
  const navigate = useNavigate();

  const {
    currentProfileState: { currentProfile },
  }: any = useContext(WalletContext);

  const { data, loading, error } = useQuery(PublicationDocument, {
    variables: {
      request: { publicationId },
      reactionRequest: currentProfile ? { profileId: currentProfile?.id } : null,
      profileId: currentProfile?.id ?? null,
    },
    skip: !publicationId,
  });

  const searchQuery = (query: string | null | undefined) => {
    window.location.replace(`/search?q=${query}&type=publications`);
  };

  useEffect(() => {
    window.scroll(0, 0);
  }, []);
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{`${
            data?.publication?.metadata.content ?? 'Art Preview'
          } - F3rn | Fine Art Discovery and Curation`}</title>
        </Helmet>
      </HelmetProvider>
      <div>
        {loading ? (
          <ArtPreviewSkelton />
        ) : (
          <div className="main-container md:min-h-screen mt-24 mb-24 md:mb-auto md:mt-24">
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
                    loading="lazy"
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
                        src={data?.publication?.profile?.picture?.original!.url! ?? ProfileLogo}
                        alt={data?.publication?.profile?.name ?? 'F3RN'}
                        loading="lazy"
                      />
                      <div className="text-primary  border-gray-500 ">
                        <p>{data && data?.publication?.metadata.name?.split('y')[1]}</p>
                      </div>
                    </Link>
                    {/* <div>
                    <Button name="Follow" type="button" variant="outline" />
                  </div> */}
                  </div>
                  <div className="px-6 flex flex-col justify-around">
                    <div>
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

                    <div className="w-full h-20 mt-72 flex flex-col gap-2  border-t">
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {data?.publication?.metadata.attributes
                          ?.filter(item => item.value !== ('image' || 'text_only'))
                          .map(item => (
                            <p
                              className="bg-gray-10 px-2 rounded-full cursor-pointer heading-6"
                              onClick={() => searchQuery(item.value)}
                              key={item.value}
                            >
                              #{item.value}
                            </p>
                          ))}
                      </div>
                      <Mirror
                        publicationId={publicationId}
                        mirrorCounts={data?.publication?.stats?.totalAmountOfMirrors}
                        primary
                      />
                    </div>
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
    </>
  );
};

export default ArtPreviewScreen;
