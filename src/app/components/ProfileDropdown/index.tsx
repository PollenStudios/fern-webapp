import {
  ChevronRightIcon,
  Cog8ToothIcon,
  QuestionMarkCircleIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';

import { Popover, Transition } from '@headlessui/react';

import { WalletContext } from 'store/WalletContextProvider';

import { Fragment, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import profileImg from 'Assets/Images/defaultLogo.png';
// import { userData } from 'Constants/Constants';
import { PageRoutes } from 'utils/config';
import clearStorage from 'utils/clearStorage';
import getIPFSLink from 'utils/getIPFSLink';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

const ProfileDropdown = () => {
  const navigate = useNavigate();
  const {
    accountState: { account },
    walletBalanceState: { balance },
    dispatchIsLoggedIn,
    dispatchCurrentProfile,
    currentProfileState: { currentProfile },
  }: any = useContext(WalletContext);

  const Disconnect = () => {
    dispatchIsLoggedIn({ type: 'success', payload: false });
    dispatchCurrentProfile({ type: 'success', payload: {} });
    clearStorage();
    navigate('/');
  };
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={classNames(
              // open ? 'text-gray-900' : 'text-gray-500',
              'group inline-flex items-center rounded-md bg-white text-base font-medium hover:text-gray-900 focus:outline-none ',
            )}
          >
            <div className="flex bg-primary items-center rounded-full cursor-pointer">
              {/* <Button type="button" additionalClasses="relative" name="Profile" /> */}
              <span className="heading-6 w-full sm:w-auto px-3 py-2 sm:px-6 sm:py-3 text-base font-medium rounded-full shadow-sm text-white focus:outline-none relative">
                Profile
              </span>
              <img
                src={
                  currentProfile?.picture?.original?.url
                    ? getIPFSLink(currentProfile?.picture.original.url)
                    : profileImg
                }
                alt={currentProfile?.name}
                className="w-10 h-10 rounded-full mr-2 object-cover"
              />
            </div>
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute z-10 -ml-4 mt-3 w-screen max-w-md transform px-2 sm:px-0 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2">
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="w-full h-screen md:h-auto md:w-[350px] bg-white absolute rounded-md  right-0 sm:right-80 md:right-70 lg:right-40">
                  <Link
                    className="flex  justify-between px-4 py-6 cursor-pointer"
                    to={PageRoutes.USER_PROFILE.split(':')[0] + currentProfile?.id}
                  >
                    <div className="flex items-center">
                      <div>
                        <img
                          src={
                            currentProfile?.picture?.original?.url
                              ? getIPFSLink(currentProfile?.picture.original.url)
                              : profileImg
                          }
                          alt={currentProfile?.name ?? currentProfile?.id}
                          className="w-12 h-12 rounded-full mr-2 object-cover"
                        />
                      </div>
                      <h6 className="font-semibold ml-2 w-36 truncate capitalize">
                        {currentProfile?.name ?? currentProfile?.id}
                      </h6>
                    </div>

                    <ChevronRightIcon className="w-6 text-gray-600" />
                  </Link>
                  <div className="border rounded-lg mx-3 cursor-pointer">
                    <div className="hover:rounded-t-md">
                      <div className="flex justify-between px-2 py-3  ">
                        <div>
                          <h3 className="heading-6 text-gray-500">Wallet Balance</h3>
                          <h2 className="heading-5">{parseFloat(balance).toFixed(2)} ETH</h2>
                        </div>
                        <div className="flex bg-gray-100 px-2 py-0.5 rounded-lg h-fit">
                          <p className="text-xs text-clip">
                            {account ? account.slice(0, 5) + '...' + account.slice(-4) : ''}
                          </p>
                          <hr className="w-3 h-3 rounded-full mt-1 ml-1.5 bg-green-500" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <Link to={PageRoutes.SETTINGS}>
                      <div className="flex hover:bg-gray-100  justify-between p-4">
                        <div className="flex items-center">
                          <Cog8ToothIcon className="w-8 h-8 text-black" />

                          <h6 className="font-semibold ml-2">Settings</h6>
                        </div>

                        <ChevronRightIcon className="w-6 text-gray-600" />
                      </div>
                    </Link>
                    <div
                      className="flex hover:bg-gray-100 cursor-pointer justify-between p-4"
                      onClick={() => alert('coming soon')}
                    >
                      <div className="flex items-center">
                        <QuestionMarkCircleIcon className="w-8 h-8 text-black" />

                        <h6 className="font-semibold ml-2">Help</h6>
                      </div>

                      <ChevronRightIcon className="w-6 text-gray-600" />
                    </div>
                    <div onClick={Disconnect} className="flex hover:bg-gray-100 cursor-pointer  justify-between p-4">
                      <div className="flex items-center">
                        <ArrowLeftOnRectangleIcon className="w-8 h-8 text-black" />

                        <h6 className="font-semibold ml-2">Disconnect</h6>
                      </div>

                      <ChevronRightIcon className="w-6 text-gray-600" />
                    </div>
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default ProfileDropdown;
