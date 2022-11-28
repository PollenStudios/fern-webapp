import noArtBoards from 'Assets/Images/noArtBoards.png';
import ProfileLogo from 'Assets/Images/defaultLogo.png';
import ArtPreviewCard from 'app/components/ArtPreviewCard';
import getIPFSLink from 'utils/getIPFSLink';
import Instagram from 'Assets/Icons/instagram.svg';
import Twitter from 'Assets/Icons/twitter.svg';
import { Button } from 'app/components/atoms/Buttons';
import { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageRoutes } from 'utils/config';
import { WalletContext } from 'store/WalletContextProvider';
import { Helmet, HelmetProvider } from 'react-helmet-async';

function View({ userProfile, isArtist, data }: any) {
  const { id } = useParams();
  const {
    isLoggedInState: { isLoggedIn },
    currentProfileState: { currentProfile },
  }: any = useContext(WalletContext);

  const userProfileAttributes = {
    emailValue: userProfile?.attributes.filter((attribute: any) => attribute.key === 'email'),
    twitterValue: userProfile?.attributes.filter((attribute: any) => attribute.key === 'twitter'),
    instagramValue: userProfile?.attributes.filter((attribute: any) => attribute.key === 'instagram'),
  };
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{`${
            userProfile ? userProfile?.name || userProfile?.id : 'Profile'
          } - F3rn | Fine Art Discovery and Curation`}</title>
        </Helmet>
      </HelmetProvider>
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
                src={
                  userProfile?.picture?.original?.url ? getIPFSLink(userProfile?.picture?.original?.url) : ProfileLogo
                }
                alt={userProfile?.name ?? userProfile?.id}
              />
            </div>
            <div className="flex justify-center flex-col pl-5 sm:pl-0">
              <p className="w-40 md:w-60 heading-6 sm:heading-5 text-center pt-28 capitalize">
                {userProfile?.name ?? userProfile?.id}
              </p>
              {isArtist && <span className="w-40 md:w-60 heading-5  text-center text-blue-900 ">Artist </span>}
              <p className="w-40 md:w-60 heading-6 sm:heading-5 text-gray-40 text-center pt-2 pb-5">
                {userProfile?.ownedBy
                  ? userProfile?.ownedBy?.slice(0, 9) + '...' + userProfile?.ownedBy?.slice(-4)
                  : ''}
              </p>
              {isLoggedIn && id === currentProfile?.id && (
                <div className="w-40 md:w-60 sm:ml-6 md:ml-0">
                  <Link to={PageRoutes.SETTINGS}>
                    <Button variant="outline" name="Edit Profile" type="button" />
                  </Link>
                </div>
              )}

              {userProfile?.bio && (
                <div>
                  <p className="heading-5 text-left  pt-5">About me</p>
                  <p className="paragraph-1 sm:paragraph-2  text-left  pt-2 pb-5 break-words">{userProfile.bio}</p>
                </div>
              )}

              {userProfile?.attributes && userProfileAttributes.emailValue.length > 0 && (
                <div>
                  <p className="heading-5 text-left  pt-2">Contact Info</p>
                  <a
                    className="paragraph-1 sm:paragraph-2 text-left  pt-2 pb-5 text-black underline block"
                    href={`mailto:${userProfileAttributes.emailValue[0]?.value}`}
                  >
                    {userProfileAttributes.emailValue[0]?.value}
                  </a>
                </div>
              )}

              {userProfile?.attributes &&
                (userProfileAttributes.twitterValue.length > 0 || userProfileAttributes.instagramValue.length > 0) && (
                  <div>
                    <p className="heading-6 sm:heading-5 text-left pt-2">Follow me</p>
                    <div className="flex space-x-6 pt-2">
                      {userProfileAttributes.twitterValue.length > 0 && (
                        <a
                          href={userProfileAttributes.twitterValue[0]?.value}
                          className="text-gray-400 hover:text-gray-500 cursor-pointer"
                          target="blank"
                        >
                          <span className="sr-only">Twitter</span>
                          <img src={Twitter} className="h-6 w-6" aria-hidden="true" alt="Twitter" />
                        </a>
                      )}
                      {userProfileAttributes.instagramValue.length > 0 && (
                        <a
                          href={userProfileAttributes.instagramValue[0]?.value}
                          className="text-gray-400 hover:text-gray-500 cursor-pointer"
                          target="blank"
                        >
                          <span className="sr-only">Instagram</span>
                          <img src={Instagram} className="h-6 w-6" aria-hidden="true" alt="Instagram" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* TODO: fix tab View */}
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
                  {id === currentProfile?.id
                    ? 'You don’t have any Art Boards yet'
                    : 'This user doesn’t have any Art Boards yet'}
                </h2>
                <h6 className="paragraph-3">
                  {id === currentProfile?.id && 'Get started by browsing art to curate your board.'}
                </h6>
                <Link to={PageRoutes.DISCOVERY} className="mt-5">
                  <Button type="button" variant="primary" name="Discover Art" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default View;
