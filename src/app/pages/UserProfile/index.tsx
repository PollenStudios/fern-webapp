import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import { Button } from 'app/components/atoms/Buttons';

import { useLazyQuery } from '@apollo/client';
import { useContext } from 'react';
import { WalletContext } from 'store/WalletContextProvider';
import noArtBoards from 'Assets/Images/noArtBoards.png';
import ProfileLogo from 'Assets/Images/defaultLogo.png';
import { ProfileDocument, ProfileFeedDocument, PublicationMainFocus, PublicationTypes } from 'graphql/generated/types';
import { PageRoutes } from 'utils/config';
import ArtPreviewCard from 'app/components/ArtPreviewCard';
import getIPFSLink from 'utils/getIPFSLink';
import Instagram from 'Assets/Icons/instagram.svg';
import Twitter from 'Assets/Icons/twitter.svg';

function UserProfile() {
  const { id } = useParams();
  const [userProfile, setUserProfile] = useState<any>();
  const [userPosts, setUserPosts] = useState<any>();

  const {
    // userProfileState: { userProfile },
    isLoggedInState: { isLoggedIn },
    currentProfileState: { currentProfile },
  }: any = useContext(WalletContext);

  // Variables
  const request = {
    publicationTypes: [PublicationTypes.Post],
    profileId: id,
    limit: 10,
    sources: ['F3RN'],
    metadata: { mainContentFocus: [PublicationMainFocus.Image] },
  };
  const reactionRequest = { profileId: id };
  const profileId = id;

  const [getPosts, { data }] = useLazyQuery(ProfileFeedDocument, {
    onCompleted: async () => {
      console.log(data);
      // setUserProfile(data?.publications?.items[0]?.profile);
      setUserPosts(data?.publications.items);
    },
  });
  const [getProfile, { data: userProfileResult }] = useLazyQuery(ProfileDocument, {
    onCompleted: async () => {
      console.log(userProfileResult);
      setUserProfile(userProfileResult?.profile);
      // setUserProfile(userProfileResult?.profile);
    },
  });
  // const fetchPosts = async () => {
  //   const getPostsResult = await getPosts({ variables: { request, reactionRequest, profileId } });
  //   return getPostsResult.data?.publications.items;
  // };
  console.log(data);
  useEffect(() => {
    getPosts({ variables: { request, reactionRequest, profileId } });
    getProfile({ variables: { request: reactionRequest } });
  }, [data, userProfileResult, id]);

  return (
    <div className="mb-10 mt-16">
      <div>
        <img
          className="w-full h-72 sm:h-96 bg-gray-300"
          src="https://images.unsplash.com/photo-1667679831953-b8fa28deb04e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxNTN8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
          alt="cover"
        />
      </div>
      <div className="main-container flex flex-col md:grid grid-cols-5">
        <div className="col-span-1 relative text-center">
          <div className="rounded-full w-48 h-48 absolute -top-24 border-4 border-white md:left-6">
            <img
              className="rounded-full object-cover bg-gray-10  w-full h-full"
              src={userProfile?.picture?.original?.url ? getIPFSLink(userProfile?.picture?.original?.url) : ProfileLogo}
              alt={userProfile?.name ?? userProfile?.id}
            />
          </div>
          <div className="flex justify-center flex-col pl-5 sm:pl-0">
            <p className="w-40 md:w-60 heading-6 sm:heading-5 text-center pt-28 capitalize">
              {userProfile?.name ?? userProfile?.id}
            </p>
            {/* {userProfile?.attributes?.filter((attribute: any) => attribute.key === 'isArtist')[0]?.value && (
              <span className="w-40 md:w-60 heading-5  text-center text-blue-900 ">Artist </span>
            )} */}
            <p className="w-40 md:w-60 heading-6 sm:heading-5 text-gray-40 text-center pt-2 pb-5">
              {userProfile?.ownedBy ? userProfile?.ownedBy?.slice(0, 9) + '...' + userProfile?.ownedBy?.slice(-4) : ''}
            </p>
            {isLoggedIn && id === currentProfile?.id && (
              <div className="w-40 md:w-60 sm:ml-6 md:ml-0">
                <Link to={PageRoutes.SETTINGS}>
                  <Button variant="outline" name="Edit Profile" type="button" />
                </Link>
              </div>
            )}

            <div>
              <p className="heading-5 text-left  pt-5">About me</p>
              <p className="paragraph-1 sm:paragraph-2  text-left  pt-2 pb-5 break-words">
                {userProfile?.bio ? userProfile.bio : 'no data found'}
              </p>
            </div>

            <div>
              <p className="heading-5 text-left  pt-2">Contact Info</p>
              {userProfile?.attributes &&
                userProfile?.attributes.filter((attribute: any) => attribute.key === 'email').length > 0 && (
                  <a
                    className="paragraph-1 sm:paragraph-2 text-left  pt-2 pb-5 text-black underline block"
                    href={`mailto:${
                      userProfile?.attributes.filter((attribute: any) => attribute.key === 'email')[0]?.value
                    }`}
                  >
                    {userProfile?.attributes.filter((attribute: any) => attribute.key === 'email')[0]?.value}
                  </a>
                )}
            </div>
            <div>
              <p className="heading-6 sm:heading-5 text-left pt-2">Follow me</p>
              <div className="flex space-x-6 pt-2">
                <a
                  href={userProfile?.attributes.filter((attribute: any) => attribute.key === 'twitter')[0]?.value}
                  className="text-gray-400 hover:text-gray-500"
                  target="blank"
                >
                  <span className="sr-only">Twitter</span>
                  <img src={Twitter} className="h-6 w-6" aria-hidden="true" alt="Twitter" />
                </a>
                <a
                  href={userProfile?.attributes.filter((attribute: any) => attribute.key === 'instagram')[0]?.value}
                  className="text-gray-400 hover:text-gray-500"
                  target="blank"
                >
                  <span className="sr-only">Instagram</span>
                  <img src={Instagram} className="h-6 w-6" aria-hidden="true" alt="Instagram" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* TODO: fix tab view */}
        <div className="col-span-4 pt-10 md:pt-auto md:pl-36">
          {/* <ul className="flex space-x-8 border-b border-black">
            {tabsData.map(({ tabName, id }) => (
              <TabsView selectedTabName={selectedTabName} key={id}>
                <li
                  onClick={() => setSelectedTabName(tabName)}
                  className={`cursor-pointer heading-5 sm:heading-4 border-primary ${selectedTabsFn(selectedTabName === tabName)}`}
                >
                  {tabName}
                </li>
              </TabsView>
            ))}
          </ul> */}
          <h6 className="heading-4 border-b border-black">All Posts</h6>

          {data?.publications.items && data?.publications.items.length > 0 ? (
            <div className="grid sm:grid-cols-8 lg:grid-cols-12 gap-6 my-2">
              {data?.publications.items.map((post: any, i: number) => (
                <div className="col-span-5 sm:col-span-4 md:col-span-6" key={i}>
                  <ArtPreviewCard art={post} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center mt-10">
              <img src={noArtBoards} alt={'noArtBoard'} className="object-cover h-44 w-44 rounded-full mb-4" />
              <h2 className="heading-4">
                {userProfile ? 'You don’t have any Art Boards yet' : 'This user doesn’t have any Art Boards yet'}
              </h2>
              <h6 className="paragraph-3">{userProfile && 'Get started by browsing art to curate your board.'}</h6>
              <Link to={PageRoutes.DISCOVERY} className="mt-5">
                <Button type="button" variant="primary" name="Discover Art" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
