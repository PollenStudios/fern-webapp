import { Button } from 'app/components/atoms/Buttons';
import ProfileLogo from 'Assets/Images/defaultLogo.png';
import { Link, useParams } from 'react-router-dom';
import { PageRoutes } from 'utils/config';
import getIPFSLink from 'utils/getIPFSLink';
import Instagram from 'Assets/Icons/instagram.svg';
import Twitter from 'Assets/Icons/twitter.svg';
import { useContext } from 'react';
import { WalletContext } from 'store/WalletContextProvider';

function UserProfileSidebar({ userProfile, isArtist }: any) {
  const { id: profileId } = useParams();
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
        {isArtist && <span className="w-40 md:w-60 heading-5  text-center text-tertiary ">Artist </span>}
        <p className="w-40 md:w-60 heading-6 sm:heading-5 text-gray-40 text-center pt-2 pb-5">
          {userProfile?.ownedBy ? userProfile?.ownedBy?.slice(0, 9) + '...' + userProfile?.ownedBy?.slice(-4) : ''}
        </p>
        {isLoggedIn && profileId === currentProfile?.id && (
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
                    href={'https://' + userProfileAttributes.twitterValue[0]?.value}
                    className="text-gray-400 hover:text-gray-500 cursor-pointer"
                    target="blank"
                  >
                    <span className="sr-only">Twitter</span>
                    <img src={Twitter} className="h-6 w-6" aria-hidden="true" alt="Twitter" />
                  </a>
                )}
                {userProfileAttributes.instagramValue.length > 0 && (
                  <a
                    href={'https://' + userProfileAttributes.instagramValue[0]?.value}
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
  );
}

export default UserProfileSidebar;
